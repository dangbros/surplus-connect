'use client'

import { logout, getUserRole } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { LayoutDashboard, LogOut, User } from 'lucide-react'

export function Header() {
    const [role, setRole] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchRole() {
            try {
                const userRole = await getUserRole()
                setRole(userRole)
            } catch (error) {
                console.error('Failed to fetch role:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchRole()
    }, [])

    return (
        <header className="flex items-center justify-between px-6 py-4 border-b bg-white sticky top-0 z-50">
            <Link href="/" className="text-xl font-bold flex items-center gap-2">
                <span className="text-green-600">Surplus</span>Connect
            </Link>

            <nav className="flex items-center gap-4">
                {!loading && (
                    <>
                        {role === 'DONOR' && (
                            <Button asChild variant="ghost">
                                <Link href="/donate">Donate Food</Link>
                            </Button>
                        )}

                        {role === 'NGO' && (
                            <Button asChild variant="ghost">
                                <Link href="/dashboard/ngo">NGO Dashboard</Link>
                            </Button>
                        )}

                        {role === 'VOLUNTEER' && (
                            <Button asChild variant="ghost">
                                <Link href="/dashboard/volunteer">Volunteer Tasks</Link>
                            </Button>
                        )}

                        {role ? (
                            <div className="flex items-center gap-2 pl-4 border-l">
                                <span className="text-xs text-muted-foreground font-medium uppercase hidden sm:block">
                                    {role}
                                </span>
                                <form action={logout}>
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </Button>
                                </form>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Button asChild variant="ghost">
                                    <Link href="/login">Login</Link>
                                </Button>
                                <Button asChild>
                                    <Link href="/login?mode=signup">Sign Up</Link>
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </nav>
        </header>
    )
}
