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
            pickup_address?: string | null
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
            pickup_address,
            image_url,
            latitude,
            longitude,
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
            latitude,
            longitude,
            pickup_address,
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

export async function completeDelivery(taskId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    // 1. Verify task ownership and status
    const { data: task, error: fetchError } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .eq('volunteer_id', user.id)
        .eq('status', 'ASSIGNED')
        .single()

    if (fetchError || !task) {
        return { error: 'Task not found or not assigned to you' }
    }

    // 2. Mark task as COMPLETED
    const { error: updateError } = await supabase
        .from('tasks')
        .update({ status: 'COMPLETED' })
        .eq('id', taskId)

    if (updateError) {
        console.error('Error completing task:', updateError)
        return { error: 'Failed to complete task' }
    }

    // 3. Award Points (50 pts) and Increment Lifetime Deliveries
    // Note: In a real app, this should be an RPC or transaction for safety.
    // For now, we fetch current, then increment.
    const { data: profile } = await supabase
        .from('profiles')
        .select('points, lifetime_deliveries')
        .eq('id', user.id)
        .single()

    const currentPoints = profile?.points || 0
    const currentDeliveries = profile?.lifetime_deliveries || 0

    const { error: rewardError } = await supabase
        .from('profiles')
        .update({
            points: currentPoints + 50,
            lifetime_deliveries: currentDeliveries + 1
        })
        .eq('id', user.id)

    if (rewardError) {
        // Log it but don't fail the user flow completely, or retry
        console.error('Error awarding points:', rewardError)
    }

    revalidatePath('/dashboard/volunteer')
    revalidatePath('/dashboard/volunteer/deliveries')
    return { success: true, pointsEarned: 50 }
}

export async function getLeaderboard() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, points, lifetime_deliveries')
        .eq('role', 'VOLUNTEER')
        .order('points', { ascending: false })
        .limit(5)

    if (error) return []
    return data
}
