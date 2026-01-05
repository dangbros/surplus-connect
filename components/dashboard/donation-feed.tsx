'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

interface Donation {
    id: string
    created_at: string
    food_category: string
    weight_kg: number
    pickup_instructions: string
    expiry_at: string
    image_url: string
    status: string
    donor_id: string
}

interface DonationFeedProps {
    initialDonations: Donation[]
}

export function DonationFeed({ initialDonations }: DonationFeedProps) {
    const [donations, setDonations] = useState<Donation[]>(initialDonations)
    const [failedImages, setFailedImages] = useState<Set<string>>(new Set())
    const supabase = createClient()

    useEffect(() => {
        setDonations(initialDonations)
    }, [initialDonations])

    useEffect(() => {
        const channel = supabase
            .channel('realtime donations')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'donations',
                    filter: 'status=eq.AVAILABLE',
                },
                (payload) => {
                    console.log('New donation received:', payload)
                    const newDonation = payload.new as Donation
                    setDonations((prev) => [newDonation, ...prev])
                    toast.info('New donation available!')
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase])

    const handleClaim = (id: string) => {
        console.log('Claiming donation:', id)
        toast.success('Claim logic would go here')
    }

    const handleImageError = (id: string) => {
        setFailedImages((prev) => {
            const newSet = new Set(prev)
            newSet.add(id)
            return newSet
        })
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations.map((donation) => (
                <Card key={donation.id} className="overflow-hidden">
                    <div className="relative h-48 w-full bg-gray-100 flex items-center justify-center">
                        {!failedImages.has(donation.id) ? (
                            <Image
                                src={donation.image_url}
                                alt={donation.food_category}
                                fill
                                className="object-cover"
                                onError={() => handleImageError(donation.id)}
                                unoptimized={true} // Skip optimization to prevent server errors on bad URLs
                            />
                        ) : (
                            <div className="text-gray-400 flex flex-col items-center">
                                <span className="text-2xl mb-1">📷</span>
                                <span className="text-xs">Image unavailable</span>
                            </div>
                        )}
                    </div>
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            <span>{donation.food_category}</span>
                            <span className="text-sm font-normal text-muted-foreground">
                                {donation.weight_kg} kg
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-500 mb-2">
                            Expires: {new Date(donation.expiry_at).toLocaleString()}
                        </p>
                        <p className="text-sm line-clamp-2">{donation.pickup_instructions}</p>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={() => handleClaim(donation.id)} className="w-full">
                            Claim Donation
                        </Button>
                    </CardFooter>
                </Card>
            ))}
            {donations.length === 0 && (
                <p className="col-span-full text-center text-gray-500 py-10">
                    No donations available at the moment.
                </p>
            )}
        </div>
    )
}
