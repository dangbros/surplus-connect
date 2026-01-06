import { getAssignedTasks } from '@/actions/volunteer'
import { DeliveryCard } from '@/components/dashboard/delivery-card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, PackageCheck } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function MyDeliveriesPage() {
  const tasks = await getAssignedTasks()

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/volunteer">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              My Deliveries
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your active food rescue tasks.
            </p>
          </div>
        </div>
      </div>

      {/* Tasks */}
      {tasks.length === 0 ? (
        // Empty state
        <div className="max-w-md mx-auto text-center py-16 space-y-6">
          <div className="bg-gray-100 h-28 w-28 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <PackageCheck className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900">No Active Deliveries</h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            You don't have any assigned tasks right now. Go to the dashboard to accept new requests!
          </p>
          <Button asChild size="lg" className="mt-2">
            <Link href="/dashboard/volunteer">
              Find Donations
            </Link>
          </Button>
        </div>
      ) : (
        // Grid of delivery cards
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <DeliveryCard key={task.id} task={task} className="hover:shadow-lg transition transform hover:-translate-y-1" />
          ))}
        </div>
      )}
    </div>
  )
}
