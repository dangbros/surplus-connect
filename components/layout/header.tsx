'use client'

import { logout } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client' // Use client for client-side checks if needed, but logout action is cleaner
import { useEffect, useState } from 'react'
import Link from 'next/link'

export function Header() {
    // Ideally we check session server side or via context, but for this quick component we'll just show logout
    // Or we can check if we have a user.
    // Given the task, just adding a Logout button that calls the action.

    return (
        <header className="flex items-center justify-between px-6 py-4 border-b bg-white">
            <Link href="/donate" className="text-xl font-bold">
                SurplusConnect
            </Link>
            <div>
                <form action={logout}>
                    <Button variant="outline">Logout</Button>
                </form>
            </div>
        </header>
    )
}
