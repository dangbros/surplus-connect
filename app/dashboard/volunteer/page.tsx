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
<<<<<<< HEAD
  const tasks = await getOpenTasks()

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8 space-y-10">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Volunteer Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            View and accept delivery tasks to help move food from donors to NGOs.
          </p>
=======
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
>>>>>>> 7a9184b89247297dfaa85d714b8d01b040610386
        </div>

        <Button
          asChild
          variant="secondary"
          className="flex items-center gap-2 mt-2 md:mt-0"
        >
          <Link href="/dashboard/volunteer/deliveries">
            <PackageCheck className="h-5 w-5" />
            My Deliveries
          </Link>
        </Button>
      </div>

      {/* Map Section */}
      {tasks.length > 0 && (
        <div className="max-w-7xl mx-auto mb-8 h-64 md:h-96 rounded-xl overflow-hidden shadow-lg">
          <VolunteerMap tasks={tasks} />
        </div>
      )}

      {/* Tasks Grid or Empty State */}
      {tasks.length === 0 ? (
        <div className="max-w-2xl mx-auto">
          <Alert className="flex flex-col items-center text-center p-8 rounded-xl shadow-md bg-white">
            <Info className="h-6 w-6 text-blue-600 mb-4" />
            <AlertTitle className="text-xl font-semibold">No Open Tasks</AlertTitle>
            <AlertDescription className="text-gray-500 mt-2">
              There are currently no delivery tasks available. Please check back later!
            </AlertDescription>
            <Button asChild className="mt-6">
              <Link href="/dashboard/volunteer/deliveries">
                Browse Donations
              </Link>
            </Button>
          </Alert>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              className="hover:shadow-lg transition transform hover:-translate-y-1"
            />
          ))}
        </div>
      )}
    </div>
  )
}
