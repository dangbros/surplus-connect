'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, MapPin, Package, Scale } from 'lucide-react'
import confetti from 'canvas-confetti'
import { acceptTask, completeDelivery, VolunteerTask } from '@/actions/volunteer'
import { CheckCircle } from 'lucide-react'

interface TaskCardProps {
    task: VolunteerTask
}

export function TaskCard({ task }: TaskCardProps) {
    const [loading, setLoading] = useState(false)
    const [isVisible, setIsVisible] = useState(true)

    const handleAccept = async () => {
        setLoading(true)
        try {
            const result = await acceptTask(task.id)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Task Assigned! You can view it in "My Tasks".')
                // No need to hide if we want to show it in assigned state immediately, 
                // but usually it moves to "My Deliveries". 
                // For now, let's refresh or hide. 
                setIsVisible(false)
            }
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    const handleComplete = async () => {
        setLoading(true)
        try {
            const result = await completeDelivery(task.id)
            if (result.error) {
                toast.error(result.error)
            } else {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                })
                toast.success(`Delivery Completed! Points +${result.pointsEarned || 50}`)
                setIsVisible(false)
            }
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    if (!isVisible) return null

    // Helper to render button action based on status
    const renderAction = () => {
        if (task.status === 'OPEN') {
            return (
                <Button
                    className="w-full"
                    onClick={handleAccept}
                    disabled={loading}
                >
                    {loading ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Accepting...</>
                    ) : (
                        'Accept Delivery'
                    )}
                </Button>
            )
        }
        if (task.status === 'ASSIGNED') {
            return (
                <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={handleComplete}
                    disabled={loading}
                >
                    {loading ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</>
                    ) : (
                        <><CheckCircle className="mr-2 h-4 w-4" /> Mark Delivered</>
                    )}
                </Button>
            )
        }
        return (
            <Button disabled variant="outline" className="w-full text-green-600 border-green-200 bg-green-50">
                Completed
            </Button>
        )
    }

    return (
        <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-bold">
                        {task.claim.donation.donor?.organization_name || 'Anonymous Donor'}
                    </CardTitle>
                    <Badge variant={task.status === 'OPEN' ? 'outline' : 'secondary'}
                        className={task.status === 'OPEN' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-green-100 text-green-800'}>
                        {task.status}
                    </Badge>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                        <span>To:</span>
                        <span className="font-semibold text-foreground">{task.claim.ngo.organization_name}</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span>{task.claim.donation.food_category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Scale className="h-4 w-4 text-muted-foreground" />
                        <span>{task.claim.donation.weight_kg} kg</span>
                    </div>
                </div>

                <div className="bg-muted/50 p-3 rounded-md text-sm">
                    <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div className="space-y-1">
                            {task.claim.donation.pickup_address ? (
                                <p className="font-medium text-xs text-primary mb-1">{task.claim.donation.pickup_address}</p>
                            ) : null}
                            <p className="line-clamp-2 text-muted-foreground">{task.claim.donation.pickup_instructions}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                {renderAction()}
            </CardFooter>
        </Card>
    )
}
