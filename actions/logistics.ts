'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function claimDonation(donationId: string, method: 'PICKUP' | 'VOLUNTEER' | 'DONOR_DELIVERY') {
    const supabase = await createClient()

    // 1. Check Auth
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, error: 'Unauthorized' }
    }

    try {
        // 2. Update Donation Status
        const { error: donationError } = await supabase
            .from('donations')
            .update({ status: 'CLAIMED' })
            .eq('id', donationId)

        if (donationError) throw donationError

        // 3. Create Claim
        const { data: claim, error: claimError } = await supabase
            .from('claims')
            .insert({
                donation_id: donationId,
                ngo_id: user.id,
                status: 'PENDING',
                fulfillment_method: method
            })
            .select()
            .single()

        if (claimError) throw claimError

        // 4. Create Task (ONLY if Volunteer is requested)
        if (method === 'VOLUNTEER') {
            const { error: taskError } = await supabase.from('tasks').insert({
                claim_id: claim.id,
                status: 'OPEN',
            })

            if (taskError) throw taskError
        }

        revalidatePath('/dashboard/ngo')
        return { success: true }
    } catch (error) {
        console.error('Claim error:', error)
        return { success: false, error: 'Failed to claim donation' }
    }
}
