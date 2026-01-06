'use client'

import { useState } from 'react'
import { login, signup } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

export default function LoginPage() {
    const [loading, setLoading] = useState(false)
    const [signupRole, setSignupRole] = useState('')

    async function handleSubmit(formData: FormData, action: 'login' | 'signup') {
        setLoading(true)

        // Manual validation for role
        if (action === 'signup') {
            const role = formData.get('role')
            if (!role) {
                toast.error('Please select a role')
                setLoading(false)
                return
            }
        }

        const result = action === 'login' ? await login(formData) : await signup(formData)
        setLoading(false)

        if (result?.error) {
            toast.error(result.error)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12">
            <Tabs defaultValue="login" className="w-full max-w-md mx-4">
                <TabsList className="grid w-full grid-cols-2 mb-4">
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
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                                </div>
                                <div className="space-y-2">
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
                                Create a new account to join the community.
                            </CardDescription>
                        </CardHeader>
                        <form action={(formData) => handleSubmit(formData, 'signup')}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="full_name">Full Name</Label>
                                    <Input id="full_name" name="full_name" placeholder="John Doe" required />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="signup-email">Email</Label>
                                    <Input id="signup-email" name="email" type="email" placeholder="m@example.com" required />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="signup-password">Password</Label>
                                    <Input id="signup-password" name="password" type="password" required />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="role">I am a...</Label>
                                    <Select name="role" required onValueChange={setSignupRole}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select your role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="DONOR">Food Donor (Restaurant/Store)</SelectItem>
                                            <SelectItem value="NGO">NGO / Charity</SelectItem>
                                            <SelectItem value="VOLUNTEER">Volunteer Driver</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {signupRole === 'NGO' && (
                                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                        <Label htmlFor="organization_name">Organization Name</Label>
                                        <Input id="organization_name" name="organization_name" placeholder="Hope Foundation" required />
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" disabled={loading}>
                                    {loading ? 'Creating account...' : 'Create Account'}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
