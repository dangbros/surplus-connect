import { getAssignedTasks } from '@/actions/volunteer'
import { DeliveryCard } from '@/components/dashboard/delivery-card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { ArrowLeft, PackageCheck } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function MyDeliveriesPage() {
    const tasks = await getAssignedTasks()

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/volunteer">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Deliveries</h1>
                    <p className="text-muted-foreground">
                        Manage your active food rescue tasks.
                    </p>
                </div>
            </div>

            {tasks.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                    <div className="bg-gray-100 h-24 w-24 rounded-full flex items-center justify-center mx-auto">
                        <PackageCheck className="h-12 w-12 text-gray-400" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold">No active deliveries</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto">
                            You don't have any assigned tasks right now. Go to the dashboard to accept new requests!
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/dashboard/volunteer">
                            Find Donations
                        </Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tasks.map((task) => (
                        <DeliveryCard key={task.id} task={task} />
                    ))}
                </div>
            )}
        </div>
    )
}
