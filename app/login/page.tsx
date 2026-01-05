'use client'

import { useState } from 'react'
import { login, signup } from '@/actions/auth' // We'll adjust imports if needed, but these are server actions.
// Actually, calling server actions from client component is fine.

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

export default function LoginPage() {
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData, action: 'login' | 'signup') {
        setLoading(true)
        const result = action === 'login' ? await login(formData) : await signup(formData)
        setLoading(false)

        if (result?.error) {
            toast.error(result.error)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Tabs defaultValue="login" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                    <Card>
                        <CardHeader>
                            <CardTitle>Login</CardTitle>
                            <CardDescription>
                                Enter your email below to login to your account.
                            </CardDescription>
                        </CardHeader>
                        <form action={(formData) => handleSubmit(formData, 'login')}>
                            <CardContent className="space-y-2">
                                <div className="space-y-1">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" name="password" type="password" required />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" disabled={loading}>
                                    {loading ? 'Logging in...' : 'Login'}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </TabsContent>
                <TabsContent value="signup">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sign Up</CardTitle>
                            <CardDescription>
                                Create a new account to start donating.
                            </CardDescription>
                        </CardHeader>
                        <form action={(formData) => handleSubmit(formData, 'signup')}>
                            <CardContent className="space-y-2">
                                <div className="space-y-1">
                                    <Label htmlFor="current-email">Email</Label>
                                    <Input id="current-email" name="email" type="email" required />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="current-password">Password</Label>
                                    <Input id="current-password" name="password" type="password" required />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" disabled={loading}>
                                    {loading ? 'Signing up...' : 'Sign Up'}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
