'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
    const supabase = await createClient()

    // Type-casting here for simplicity, in a real app use Zod
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        return { error: error.message }
    }

    redirect('/donate')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        options: {
            data: {
                full_name: formData.get('full_name') as string,
                role: formData.get('role') as string,
                organization_name: formData.get('organization_name') as string,
            },
        },
    }

    // NOTE: For a hackathon, we might want to disable email confirmation or handle it gracefully.
    // Using signInWithPassword immediately after might fail if confirmation is required.
    // We'll just try to sign up.
    // If your Supabase project has "Confirm email" enabled, you might need to check for that.
    // For now, assuming auto-confirm or email verification flow is handled by Supabase.
    const { error } = await supabase.auth.signUp(data)

    if (error) {
        return { error: error.message }
    }

    redirect('/')
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
}

export async function getUserRole() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    return profile?.role || null
}
