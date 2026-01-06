'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email')?.toString()
  const password = formData.get('password')?.toString()

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/donate')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email')?.toString()
  const password = formData.get('password')?.toString()
  const fullName = formData.get('full_name')?.toString()
  const role = formData.get('role')?.toString()
  const organizationName = formData.get('organization_name')?.toString()

  if (!email || !password || !role) {
    return { error: 'Missing required fields' }
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role,
        organization_name: role === 'NGO' ? organizationName : null,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Hackathon-friendly: go straight to login
  redirect('/login')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function getUserRole() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // If you're storing role in auth metadata (recommended)
  return user.user_metadata?.role || null
}
