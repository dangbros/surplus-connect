'use client'

import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Calendar, Clock, MapPin, ShieldCheck, Weight } from 'lucide-react'
import { claimDonation } from '@/actions/logistics'
import { toast } from 'sonner'
import Image from 'next/image'

interface Donation {
    id: string
    food_category: string
    weight_kg: number
    expiry_at: string
    image_url: string
    pickup_instructions: string
    // New fields
    freshness_score?: number | null
    ai_notes?: string | null
    pickup_address?: string | null
    donor_id?: string
    status?: string
    can_deliver?: boolean
}

interface DonationFeedProps {
    initialDonations: Donation[]
}

export function DonationFeed({ initialDonations }: DonationFeedProps) {
    const [donations, setDonations] = useState<Donation[]>(initialDonations)
    const [loadingId, setLoadingId] = useState<string | null>(null)

    const [selectedMethod, setSelectedMethod] = useState<'PICKUP' | 'VOLUNTEER' | 'DONOR_DELIVERY'>('VOLUNTEER')

    async function handleClaim(id: string) {
        setLoadingId(id)
        try {
            const result = await claimDonation(id, selectedMethod)
            if (result.success) {
                if (selectedMethod === 'VOLUNTEER') {
                    toast.success('Task posted for volunteers! 🚚')
                } else {
                    toast.success('Claimed! Address saved to your profile. ✅')
                }
                setDonations((prev) => prev.filter((d) => d.id !== id))
            } else {
                toast.error(result.error || 'Failed to claim donation')
            }
        } catch (error) {
            console.error('Claim error:', error)
            toast.error('An unexpected error occurred')
        } finally {
            setLoadingId(null)
        }
    }

    if (donations.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-muted-foreground">No donations available at the moment.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations.map((donation) => (
                <Card key={donation.id} className="overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                    <div className="relative h-48 w-full bg-gray-100">
                        {donation.image_url ? (
                            <Image
                                src={donation.image_url}
                                alt={donation.food_category}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                No Image
                            </div>
                        )}
                        <div className="absolute top-2 right-2 flex flex-col gap-2">
                            <Badge className="bg-white/90 text-black hover:bg-white/90 shadow-sm backdrop-blur-sm">
                                {donation.food_category}
                            </Badge>
                            {donation.freshness_score && (
                                <Badge className="bg-green-100/90 text-green-700 hover:bg-green-100/90 shadow-sm backdrop-blur-sm flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3" />
                                    AI Score: {donation.freshness_score}/10
                                </Badge>
                            )}
                        </div>
                    </div>

                    <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    {donation.weight_kg}kg {donation.food_category}
                                </CardTitle>
                                <div className="flex items-center text-sm text-muted-foreground mt-1">
                                    <Clock className="w-3 h-3 mr-1" />
                                    Expires: {new Date(donation.expiry_at).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-4 pt-2 flex-grow">
                        {donation.ai_notes ? (
                            <p className="text-sm text-gray-600 line-clamp-2 italic">
                                "{donation.ai_notes}"
                            </p>
                        ) : (
                            <p className="text-sm text-gray-500">No additional AI notes.</p>
                        )}
                    </CardContent>

                    <CardFooter className="p-4 bg-gray-50/50 flex gap-2">
                        {/* View Details Dialog */}
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="w-full bg-green-600 hover:bg-green-700">
                                    Review & Claim
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl flex items-center gap-2">
                                        {donation.food_category} • {donation.weight_kg}kg
                                    </DialogTitle>
                                    <DialogDescription>
                                        Posted on {new Date().toLocaleDateString()}
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="relative h-64 w-full rounded-lg overflow-hidden bg-gray-100 my-4">
                                    {donation.image_url && (
                                        <Image
                                            src={donation.image_url}
                                            alt={donation.food_category}
                                            fill
                                            className="object-cover"
                                        />
                                    )}
                                </div>

                                <div className="space-y-6">
                                    {/* AI Report Section */}
                                    <div className="bg-green-50/50 p-4 rounded-lg border border-green-100">
                                        <h3 className="font-semibold text-green-800 flex items-center gap-2 mb-2">
                                            <ShieldCheck className="w-5 h-5" /> Gemini AI Analysis
                                        </h3>
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-muted-foreground uppercase font-bold">Freshness Score</span>
                                                <span className="text-2xl font-bold text-green-700">{donation.freshness_score || 'N/A'}/10</span>
                                            </div>
                                            <div className="h-8 w-px bg-green-200"></div>
                                            <div className="flex flex-col">
                                                <span className="text-xs text-muted-foreground uppercase font-bold">Category</span>
                                                <span className="font-medium">{donation.food_category}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-xs text-muted-foreground uppercase font-bold">AI Reasoning</span>
                                            <p className="text-gray-700 italic">
                                                "{donation.ai_notes || 'No specific notes available for this item.'}"
                                            </p>
                                        </div>
                                    </div>

                                    {/* Logistics Selection Section */}
                                    <div>
                                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                                            <MapPin className="w-5 h-5 text-blue-600" /> Fulfillment Method
                                        </h3>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <button
                                                onClick={() => setSelectedMethod('PICKUP')}
                                                className={`p-3 rounded-lg border text-left transition-all hover:bg-blue-50 ${selectedMethod === 'PICKUP' ? 'ring-2 ring-blue-600 bg-blue-50 border-blue-600' : 'bg-white border-gray-200'}`}
                                            >
                                                <span className="block text-xl mb-1">🙋</span>
                                                <span className="block font-semibold text-sm">Self Pickup</span>
                                                <span className="block text-xs text-muted-foreground">I will collect it</span>
                                            </button>

                                            <button
                                                onClick={() => setSelectedMethod('VOLUNTEER')}
                                                className={`p-3 rounded-lg border text-left transition-all hover:bg-blue-50 ${selectedMethod === 'VOLUNTEER' ? 'ring-2 ring-blue-600 bg-blue-50 border-blue-600' : 'bg-white border-gray-200'}`}
                                            >
                                                <span className="block text-xl mb-1">🚚</span>
                                                <span className="block font-semibold text-sm">Volunteer</span>
                                                <span className="block text-xs text-muted-foreground">Request help</span>
                                            </button>

                                            <button
                                                onClick={() => setSelectedMethod('DONOR_DELIVERY')}
                                                className={`p-3 rounded-lg border text-left transition-all hover:bg-blue-50 ${selectedMethod === 'DONOR_DELIVERY' ? 'ring-2 ring-blue-600 bg-blue-50 border-blue-600' : 'bg-white border-gray-200'}`}
                                            >
                                                <span className="block text-xl mb-1">📦</span>
                                                <span className="block font-semibold text-sm">Donor Drop-off</span>
                                                <span className="block text-xs text-muted-foreground">Donor delivers</span>
                                            </button>
                                        </div>

                                        <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm border">
                                            <p className="font-medium text-gray-700 mb-1">Pickup Information:</p>
                                            <p className="text-gray-600">{donation.pickup_instructions}</p>
                                            {donation.pickup_address && <p className="text-gray-600 mt-1 max-w-full truncate">{donation.pickup_address}</p>}
                                        </div>
                                    </div>
                                </div>

                                <DialogFooter className="mt-6 gap-2 sm:gap-0">
                                    <Button onClick={() => handleClaim(donation.id)} disabled={loadingId === donation.id} className="w-full bg-green-600 hover:bg-green-700 h-11 text-base">
                                        {loadingId === donation.id ? 'Processing...' : `Confirm: ${selectedMethod === 'VOLUNTEER' ? 'Request Volunteer' : selectedMethod === 'PICKUP' ? 'I Will Pickup' : 'Request Drop-off'}`}
                                    </Button>
                                </DialogFooter>

                            </DialogContent>
                        </Dialog>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}
