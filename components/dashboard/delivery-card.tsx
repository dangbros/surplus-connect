'use client'

import { useState } from 'react'
import { VolunteerTask, markAsDelivered } from '@/actions/volunteer'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Navigation, CheckCircle, Loader2, Package } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface DeliveryCardProps {
    task: VolunteerTask
}

export function DeliveryCard({ task }: DeliveryCardProps) {
    const [loading, setLoading] = useState(false)
    const { donation, ngo } = task.claim

    const handleComplete = async () => {
        setLoading(true)
        try {
            const result = await markAsDelivered(task.id)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Delivery completed! Great job!')
            }
        } catch (error) {
            toast.error('Failed to update status')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="flex flex-col h-full overflow-hidden border-l-4 border-l-green-500">
            <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Active Delivery
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                        ID: {task.id.slice(0, 8)}
                    </span>
                </div>
                <CardTitle className="text-lg mt-2 flex items-center gap-2">
                    <Package className="h-5 w-5 text-gray-500" />
                    {donation.food_category}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-4 pt-2 space-y-4">
                {donation.image_url && (
                    <div className="relative h-32 w-full rounded-md overflow-hidden bg-gray-100">
                        <Image
                            src={donation.image_url}
                            alt={donation.food_category}
                            fill
                            className="object-cover"
                            unoptimized={true} // Handle potential invalid URLs gracefully
                        />
                    </div>
                )}

                <div className="space-y-3 text-sm">
                    {/* Pickup Section */}
                    <div className="p-3 bg-gray-50 rounded-lg space-y-1">
                        <p className="font-semibold text-gray-700 flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-blue-500" /> Pickup (Donor)
                        </p>
                        <p className="pl-5 text-gray-900">{donation.donor?.organization_name}</p>
                        <p className="pl-5 text-gray-500 text-xs">{donation.pickup_instructions}</p>
                    </div>

                    {/* Dropoff Section */}
                    <div className="p-3 bg-gray-50 rounded-lg space-y-1">
                        <p className="font-semibold text-gray-700 flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-green-500" /> Drop-off (NGO)
                        </p>
                        <p className="pl-5 text-gray-900">{ngo.organization_name}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                        <span>Weight: {donation.weight_kg} kg</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 gap-3">
                <Button
                    className="flex-1"
                    variant="outline"
                    asChild
                >
                    {/* Link to Google Maps Directions from Pickup (approx) to Dropoff (approx) 
                        Note: We only have rough coords or addresses usually. 
                        For now using search query.
                    */}
                    <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ngo.organization_name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Navigation className="mr-2 h-4 w-4" />
                        Navigate
                    </a>
                </Button>
                <Button
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleComplete}
                    disabled={loading}
                >
                    {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <CheckCircle className="mr-2 h-4 w-4" />
                    )}
                    Complete
                </Button>
            </CardFooter>
        </Card>
    )
}
