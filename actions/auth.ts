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
    const supabase = createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    // NOTE: For a hackathon, we might want to disable email confirmation or handle it gracefully.
    // Using signInWithPassword immediately after might fail if confirmation is required.
    // We'll just try to sign up.
    const { error } = await (await supabase).auth.signUp(data)

    if (error) {
        return { error: error.message }
    }

    redirect('/donate')
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
}
