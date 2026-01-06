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
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [organizationName, setOrganizationName] = useState('')

  async function handleSubmit(action: 'login' | 'signup') {
    setLoading(true)
    try {
      if (action === 'signup') {
        if (!signupRole) return toast.error('Please select a role')
        if (!fullName.trim()) return toast.error('Full name is required')
        if (!email.trim()) return toast.error('Email is required')
        if (!password || password.length < 6) return toast.error('Password must be at least 6 characters')
        if (signupRole === 'NGO' && !organizationName.trim()) return toast.error('Organization Name is required for NGO')

        const data = { full_name: fullName, email, password, role: signupRole as 'DONOR' | 'NGO' | 'VOLUNTEER', organization_name: signupRole === 'NGO' ? organizationName : undefined }
        const result = await signup(data as any)
        result?.error ? toast.error(result.error) : toast.success('Account created successfully!')
      } else {
        const data = { email, password }
        const result = await login(data as any)
        result?.error ? toast.error(result.error) : toast.success('Logged in successfully!')
      }
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12">
      <Tabs defaultValue="login" className="w-full max-w-md mx-4">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>

        {/* Login Form */}
        <TabsContent value="login">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Enter your email and password to login.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input id="login-email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required aria-required="true" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required aria-required="true" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled={loading || !email || !password} onClick={() => handleSubmit('login')}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Signup Form */}
        <TabsContent value="signup">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>Create a new account to join the community.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input id="full_name" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input id="signup-email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">I am a...</Label>
                <Select name="role" value={signupRole} onValueChange={setSignupRole} required>
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
                  <Input id="organization_name" placeholder="Hope Foundation" value={organizationName} onChange={(e) => setOrganizationName(e.target.value)} required />
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                disabled={loading || !fullName || !email || !password || !signupRole || (signupRole === 'NGO' && !organizationName)}
                onClick={() => handleSubmit('signup')}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}