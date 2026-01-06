'use client'

import { useState } from 'react'
import { VolunteerTask, completeDelivery } from '@/actions/volunteer'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Navigation, CheckCircle, Loader2, Package } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import confetti from 'canvas-confetti'

interface DeliveryCardProps {
    task: VolunteerTask
}

export function DeliveryCard({ task }: DeliveryCardProps) {
    const [loading, setLoading] = useState(false)
    const { donation, ngo } = task.claim

    const handleComplete = async () => {
        setLoading(true)
        try {
<<<<<<< HEAD
            const result = await markAsDelivered(task.id)
            if (result.error) toast.error(result.error)
            else toast.success('Delivery completed! Great job!')
        } catch {
=======
            const result = await completeDelivery(task.id)
            if (result.error) {
                toast.error(result.error)
            } else {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                })
                toast.success(`Delivery completed! Points +${result.pointsEarned || 50}`)
            }
        } catch (error) {
>>>>>>> 7a9184b89247297dfaa85d714b8d01b040610386
            toast.error('Failed to update status')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="flex flex-col h-full overflow-hidden border-l-4 border-l-yellow-500 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        Active Delivery
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                        ID: {task.id.slice(0, 8)}
                    </span>
                </div>
                <CardTitle className="text-lg mt-2 flex items-center gap-2 font-semibold">
                    <Package className="h-5 w-5 text-yellow-600" />
                    {donation.food_category}
                </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 p-4 pt-2 space-y-4">
                {donation.image_url && (
                    <div className="relative h-36 w-full rounded-lg overflow-hidden bg-gray-100 shadow-inner">
                        <Image
                            src={donation.image_url}
                            alt={donation.food_category}
                            fill
                            className="object-cover"
                            unoptimized={true}
                        />
                    </div>
                )}

                <div className="space-y-3 text-sm">
                    {/* Pickup Section */}
                    <div className="p-3 bg-gray-50 rounded-lg space-y-1 shadow-sm">
                        <p className="font-semibold text-gray-700 flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-blue-500" /> Pickup (Donor)
                        </p>
                        <p className="pl-5 text-gray-900">{donation.donor?.organization_name}</p>
                        <p className="pl-5 text-gray-500 text-xs">{donation.pickup_instructions}</p>
                    </div>

                    {/* Dropoff Section */}
                    <div className="p-3 bg-gray-50 rounded-lg space-y-1 shadow-sm">
                        <p className="font-semibold text-gray-700 flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-green-500" /> Drop-off (NGO)
                        </p>
                        <p className="pl-5 text-gray-900">{ngo.organization_name}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                        <span>Weight: {donation.weight_kg} kg</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 flex gap-3">
                <Button
                    className="flex-1 flex items-center justify-center gap-2"
                    variant="outline"
                    asChild
                >
                    <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ngo.organization_name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                    >
                        <Navigation className="h-4 w-4 text-yellow-600" />
                        Navigate
                    </a>
                </Button>

                <Button
                    className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white"
                    onClick={handleComplete}
                    disabled={loading}
                >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                    Complete
                </Button>
            </CardFooter>
        </Card>
    )
}
