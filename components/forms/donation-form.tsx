'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useState } from 'react'
import dynamic from 'next/dynamic'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { submitDonation } from '@/actions/donate'
import { analyzeFoodImage } from '@/actions/ai-check'
import { Loader2 } from 'lucide-react'

// Dynamically import OSMPicker with no SSR
const OSMPicker = dynamic(() => import('@/components/ui/osm-picker'), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-muted animate-pulse rounded-md" />
})

const formSchema = z.object({
    food_category: z.enum(['Cooked', 'Raw', 'Packaged']),
    weight_kg: z.coerce.number().positive('Weight must be positive'),
    expiry_hours: z.coerce.number().positive('Expiry hours must be positive'),
    pickup_instructions: z.string().min(1, 'Pickup instructions are required'),
    pickup_address: z.string().min(1, 'Pickup address is required'),
    can_deliver: z.boolean().optional(),
})

type FormDataValues = z.infer<typeof formSchema>

interface AIResult {
    is_safe: boolean
    freshness_score: number
    detected_category: 'Cooked' | 'Raw' | 'Packaged' | 'Unknown'
    reasoning: string
}

export function DonationForm() {
    const [loading, setLoading] = useState(false)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [aiResult, setAiResult] = useState<AIResult | null>(null)

    // Explicit state for coordinates
    const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset,
    } = useForm<FormDataValues>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            pickup_instructions: '',
        },
    })

    const handleVerifyFreshness = async () => {
        const fileInput = document.getElementById('image') as HTMLInputElement
        const file = fileInput?.files?.[0]

        if (!file) {
            toast.error('Please select an image first')
            return
        }

        setIsAnalyzing(true)
        setAiResult(null)

        const formData = new FormData()
        formData.append('image', file)

        try {
            const result = await analyzeFoodImage(formData)

            if (result.error) {
                toast.error(result.error)
            } else {
                setAiResult(result)
                if (result.is_safe) {
                    toast.success('Food verified as safe!')
                    if (['Cooked', 'Raw', 'Packaged'].includes(result.detected_category)) {
                        setValue('food_category', result.detected_category as any)
                    }
                } else {
                    toast.warning('Food content flagged by AI')
                }
            }
        } catch (err) {
            toast.error('Failed to analyze image')
        } finally {
            setIsAnalyzing(false)
        }
    }

    const onSubmit = async (data: FormDataValues) => {
        const fileInput = document.getElementById('image') as HTMLInputElement
        const file = fileInput?.files?.[0]

        if (!file) {
            toast.error('Please select an image')
            return
        }

        setLoading(true)
        const formData = new FormData()
        formData.append('food_category', data.food_category)
        formData.append('weight_kg', data.weight_kg.toString())
        formData.append('expiry_hours', data.expiry_hours.toString())
        formData.append('pickup_instructions', data.pickup_instructions)
        formData.append('pickup_address', data.pickup_address)
        formData.append('image', file)

        if (data.can_deliver) {
            formData.append('can_deliver', 'true')
        }

        // Add coordinates if available
        if (coordinates) {
            formData.append('latitude', coordinates.lat.toString())
            formData.append('longitude', coordinates.lng.toString())
        }

        // Add hidden AI fields
        formData.append('freshness_score', aiResult?.freshness_score?.toString() || '')
        formData.append('ai_notes', aiResult?.reasoning || '')

        try {
            const result = await submitDonation(null, formData)

            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Donation submitted successfully!')
                reset()
                setCoordinates(null) // Reset coords
                setAiResult(null)
                if (fileInput) fileInput.value = ''
            }
        } catch (error) {
            toast.error('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg mx-auto p-6 border rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Donate Food</h2>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="image">Photo</Label>
                    <div className="flex gap-2">
                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            className="flex-1"
                            onChange={() => setAiResult(null)} // Reset AI result on new file
                        />
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleVerifyFreshness}
                            disabled={isAnalyzing}
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                'Verify Freshness'
                            )}
                        </Button>
                    </div>
                    {/* Simple file handling for this demo */}
                </div>

                {aiResult && (
                    <div className={`p-4 rounded-md border ${aiResult.is_safe ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">{aiResult.is_safe ? '✅' : '⚠️'}</span>
                            <h3 className={`font-semibold ${aiResult.is_safe ? 'text-green-800' : 'text-red-800'}`}>
                                {aiResult.is_safe ? 'AI Verified Safe' : 'Safety Concerns Detected'}
                            </h3>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{aiResult.reasoning}</p>
                        <div className="flex gap-4 text-xs text-gray-500">
                            <span>Score: {aiResult.freshness_score}/10</span>
                            <span>Detected: {aiResult.detected_category}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="food_category">Food Category</Label>
                <Select onValueChange={(val) => setValue('food_category', val as any)} value={watch('food_category')}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Cooked">Cooked</SelectItem>
                        <SelectItem value="Raw">Raw</SelectItem>
                        <SelectItem value="Packaged">Packaged</SelectItem>
                    </SelectContent>
                </Select>
                {errors.food_category && (
                    <p className="text-sm text-red-500">{errors.food_category.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="weight_kg">Weight (kg)</Label>
                <Input
                    id="weight_kg"
                    type="number"
                    step="0.1"
                    {...register('weight_kg')}
                />
                {errors.weight_kg && (
                    <p className="text-sm text-red-500">{errors.weight_kg.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="expiry_hours">Safe For (Hours)</Label>
                <Input
                    id="expiry_hours"
                    type="number"
                    step="1"
                    {...register('expiry_hours')}
                />
                {errors.expiry_hours && (
                    <p className="text-sm text-red-500">{errors.expiry_hours.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="pickup_instructions">Pickup Instructions</Label>
                <Textarea
                    id="pickup_instructions"
                    placeholder="Enter detailed pickup instructions..."
                    {...register('pickup_instructions')}
                />
                {errors.pickup_instructions && (
                    <p className="text-sm text-red-500">
                        {errors.pickup_instructions.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label>Pickup Location</Label>
                <OSMPicker
                    onLocationSelect={(loc) => {
                        setCoordinates({ lat: loc.lat, lng: loc.lng })
                        setValue('pickup_address', loc.address)
                    }}
                />
                {/* Hidden input to satisfy Zod validation on 'pickup_address' if needed, though OSMPicker updates it via setValue */}
                <input type="hidden" {...register('pickup_address')} />
                {errors.pickup_address && (
                    <p className="text-sm text-red-500">
                        {errors.pickup_address.message}
                    </p>
                )}
            </div>

            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="can_deliver"
                    {...register('can_deliver')}
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <Label htmlFor="can_deliver" className="font-medium cursor-pointer">
                    I can deliver this item personally if needed 🚗
                </Label>
            </div>

            {/* Hidden fields to pass AI data to Server Action */}
            <input type="hidden" name="freshness_score" value={aiResult?.freshness_score || ''} />
            <input type="hidden" name="ai_notes" value={aiResult?.reasoning || ''} />

            <Button type="submit" className="w-full" disabled={loading || (!!aiResult && !aiResult.is_safe)}>
                {loading ? 'Submitting...' : 'Submit Donation'}
            </Button>
            {!aiResult?.is_safe && aiResult && (
                <p className="text-center text-xs text-red-600 mt-2">
                    ⚠️ You cannot submit until the AI verifies the food is safe.
                </p>
            )}
        </form>
    )
}
