import { getOpenTasks } from '@/actions/volunteer'
import { TaskCard } from '@/components/dashboard/task-card'
import { VolunteerMap } from '@/components/dashboard/volunteer-map'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Info } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function VolunteerDashboardPage() {
    const tasks = await getOpenTasks()

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Volunteer Dashboard</h1>
                <p className="text-muted-foreground">
                    View and accept delivery tasks to help move food from donors to NGOs.
                </p>
            </div>

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </div>
            )}
        </div>
    )
}
