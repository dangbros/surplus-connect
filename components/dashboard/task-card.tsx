'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, MapPin, Package, Scale } from 'lucide-react'
import { acceptTask, VolunteerTask } from '@/actions/volunteer'

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
                setIsVisible(false) // Optimistically hide the card
            }
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    if (!isVisible) return null

    return (
        <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-bold">Disclaimer: Test Task</CardTitle>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Open</Badge>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                        <span className="font-semibold text-foreground">{task.claim.donation.donor?.organization_name}</span>
                        <span>→</span>
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
                        <p className="line-clamp-2">{task.claim.donation.pickup_instructions}</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button
                    className="w-full"
                    onClick={handleAccept}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Accepting...
                        </>
                    ) : (
                        'Accept Delivery'
                    )}
                </Button>
            </CardFooter>
        </Card>
    )
}
