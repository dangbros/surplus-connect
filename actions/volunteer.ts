'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface VolunteerTask {
    id: string
    status: string
    created_at: string
    claim: {
        id: string
        ngo: {
            organization_name: string
        }
        donation: {
            id: string
            food_category: string
            weight_kg: number
            pickup_instructions: string
            image_url: string | null
            latitude?: number | null
            longitude?: number | null
            donor?: {
                organization_name: string
            }
        }
    }
}

export async function getOpenTasks(): Promise<VolunteerTask[]> {
    const supabase = await createClient()

    // Fetch tasks with nested claims, ngo, and donations
    const { data: tasks, error } = await supabase
        .from('tasks')
        .select(`
      id,
      status,
      created_at,
      claim:claims (
        id,
        ngo:profiles!ngo_id (organization_name),
        donation:donations (
            id,
            food_category,
            weight_kg,
            pickup_instructions,
            image_url,
            donor_id
        )
      )
    `)
        .eq('status', 'OPEN')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching tasks:', error)
        return []
    }

    if (!tasks || tasks.length === 0) return []

    const donorIds = [
        ...new Set(
            tasks
                .map((t: any) => t.claim?.donation?.donor_id)
                .filter(Boolean)
        ),
    ]

    let donorsMap: Record<string, string> = {}

    if (donorIds.length > 0) {
        const { data: donors } = await supabase
            .from('profiles')
            .select('id, organization_name')
            .in('id', donorIds)

        if (donors) {
            donorsMap = donors.reduce((acc, donor) => {
                acc[donor.id] = donor.organization_name || 'Anonymous Donor'
                return acc
            }, {} as Record<string, string>)
        }
    }

    // Transform data to match interface
    const formattedTasks: VolunteerTask[] = tasks.map((task: any) => ({
        id: task.id,
        status: task.status,
        created_at: task.created_at,
        claim: {
            id: task.claim.id,
            ngo: {
                organization_name: task.claim.ngo?.organization_name || 'Unknown NGO'
            },
            donation: {
                ...task.claim.donation,
                donor: {
                    organization_name: donorsMap[task.claim.donation.donor_id] || 'Unknown Donor'
                }
            }
        }
    }))

    return formattedTasks
}

export async function acceptTask(taskId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase
        .from('tasks')
        .update({
            status: 'ASSIGNED',
            volunteer_id: user.id
        })
        .eq('id', taskId)
        .eq('status', 'OPEN') // Ensure we only accept open tasks

    if (error) {
        console.error('Error accepting task:', error)
        return { error: 'Failed to accept task' }
    }

    revalidatePath('/dashboard/volunteer')
    return { success: true }
}

export async function getAssignedTasks(): Promise<VolunteerTask[]> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    // Fetch tasks where volunteer_id is current user and status is ASSIGNED
    const { data: tasks, error } = await supabase
        .from('tasks')
        .select(`
      id,
      status,
      created_at,
      claim:claims (
        id,
        ngo:profiles!ngo_id (organization_name),
        donation:donations (
            id,
            food_category,
            weight_kg,
            pickup_instructions,
            image_url,
            donor_id
        )
      )
    `)
        .eq('status', 'ASSIGNED')
        // .eq('volunteer_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching assigned tasks:', error)
        return []
    }

    if (!tasks || tasks.length === 0) return []

    // Fetch donor names manually (same logic as getOpenTasks)
    const donorIds = [
        ...new Set(
            tasks
                .map((t: any) => t.claim?.donation?.donor_id)
                .filter(Boolean)
        ),
    ]

    let donorsMap: Record<string, string> = {}

    if (donorIds.length > 0) {
        const { data: donors } = await supabase
            .from('profiles')
            .select('id, organization_name')
            .in('id', donorIds)

        if (donors) {
            donorsMap = donors.reduce((acc, donor) => {
                acc[donor.id] = donor.organization_name || 'Anonymous Donor'
                return acc
            }, {} as Record<string, string>)
        }
    }

    const formattedTasks: VolunteerTask[] = tasks.map((task: any) => ({
        id: task.id,
        status: task.status,
        created_at: task.created_at,
        claim: {
            id: task.claim.id,
            ngo: {
                organization_name: task.claim.ngo?.organization_name || 'Unknown NGO'
            },
            donation: {
                ...task.claim.donation,
                // Keep latitude/longitude logic consistent (undefined if null in DB)
                donor: {
                    organization_name: donorsMap[task.claim.donation.donor_id] || 'Unknown Donor'
                }
            }
        }
    }))

    return formattedTasks
}

export async function markAsDelivered(taskId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const { error } = await supabase
        .from('tasks')
        .update({
            status: 'COMPLETED'
        })
        .eq('id', taskId)
        .eq('volunteer_id', user.id) // Ensure only the assigned volunteer can complete it
        .eq('status', 'ASSIGNED')

    if (error) {
        console.error('Error completing task:', error)
        return { error: 'Failed to complete task' }
    }

    revalidatePath('/dashboard/volunteer/deliveries')
    return { success: true }
}
