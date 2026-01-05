'use server'

import { createClient } from '@/lib/supabase/server'

export async function getAvailableDonations() {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('donations')
            .select('*')
            .eq('status', 'AVAILABLE')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching donations:', error)
            return []
        }

        return data
    } catch (err) {
        console.error('Unexpected error fetching donations:', err)
        return [] // Return empty array on crash to prevent page breakage
    }
}
