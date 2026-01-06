import { getOpenTasks, getLeaderboard } from '@/actions/volunteer'
import { TaskCard } from '@/components/dashboard/task-card'
import { VolunteerMap } from '@/components/dashboard/volunteer-map'
import { Leaderboard } from '@/components/dashboard/leaderboard'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Info, PackageCheck } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function VolunteerDashboardPage() {
    const tasks = await getOpenTasks()
    const leaderboard = await getLeaderboard()

    // Get current user for highlighting in leaderboard
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Volunteer Dashboard</h1>
                <p className="text-muted-foreground">
                    View and accept delivery tasks to help move food from donors to NGOs.
                </p>
                <div className="pt-2">
                    <Button asChild variant="secondary" className="gap-2">
                        <Link href="/dashboard/volunteer/deliveries">
                            <PackageCheck className="h-4 w-4" />
                            My Deliveries
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 space-y-8">
                    {tasks.length > 0 && (
                        <VolunteerMap tasks={tasks} />
                    )}

                    {tasks.length === 0 ? (
                        <Alert>
                            <Info className="h-4 w-4" />
                            <AlertTitle>No open tasks</AlertTitle>
                            <AlertDescription>
                                There are currently no delivery tasks available. Please check back later!
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                            {tasks.map((task) => (
                                <TaskCard key={task.id} task={task} />
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <Leaderboard users={leaderboard} currentUserId={user?.id} />
                </div>
            </div>
        </div>
    )
}
