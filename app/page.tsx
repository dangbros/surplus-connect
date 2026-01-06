import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowRight, Camera, CheckCircle, Truck, Heart, Users, Utensils, Leaf, Scale, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ActionGrid } from '@/components/home/action-grid'

export default async function LandingPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let role = null
    let fullName = null

    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role, full_name')
            .eq('id', user.id)
            .single()

        role = profile?.role
        fullName = profile?.full_name || user.email?.split('@')[0]
    }

    if (user) {
        // Logged In Dashboard View
        return (
            <div className="flex flex-col min-h-screen bg-gray-50/30">
                {/* Dashboard Hero */}
                <section className="bg-gradient-to-r from-green-50 to-emerald-100 border-b">
                    <div className="container px-4 py-12 mx-auto">
                        <div className="max-w-4xl">
                            <Badge variant="outline" className="mb-4 bg-white/50 backdrop-blur-sm border-green-200 text-green-800">
                                Welcome Back
                            </Badge>
                            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
                                Hi, <span className="text-green-700">{fullName}</span>! 👋
                            </h1>
                            <p className="text-gray-600 text-lg max-w-2xl">
                                Your contributions are making a real difference. Check out your latest stats below.
                            </p>
                        </div>
                    </div>
                </section>

                <div className="container px-4 mx-auto py-8">

                    {/* Impact Stats Grid (Demo Data) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card className="border-none shadow-sm bg-white">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Food Saved</CardTitle>
                                <Scale className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">128 kg</div>
                                <p className="text-xs text-muted-foreground">+12% from last month</p>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-sm bg-white">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">People Fed</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">320</div>
                                <p className="text-xs text-muted-foreground">Est. meals provided</p>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-sm bg-white">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">CO2 Offset</CardTitle>
                                <Leaf className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">45 kg</div>
                                <p className="text-xs text-muted-foreground">Equivalent to 4 trees planted</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Quick Actions */}
                        <div className="lg:col-span-2">
                            <ActionGrid role={role} userName={fullName} />
                        </div>

                        {/* Right Column: Recent Activity */}
                        <div className="lg:col-span-1">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                Recent Activity
                            </h2>
                            <Card className="border shadow-sm">
                                <CardHeader>
                                    <CardTitle>Timeline</CardTitle>
                                    <CardDescription>Your latest actions in the network.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        <div className="flex items-start gap-4">
                                            <div className="bg-green-100 p-2 rounded-full">
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">Donation Verified</p>
                                                <p className="text-xs text-muted-foreground">Surplus Bread (5kg) was verified by AI.</p>
                                                <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                                                    <Clock className="w-3 h-3" /> 2h ago
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="bg-blue-100 p-2 rounded-full">
                                                <Truck className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">Pickup Scheduled</p>
                                                <p className="text-xs text-muted-foreground">Volunteer assigned to 'Vegetables Batch'.</p>
                                                <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                                                    <Clock className="w-3 h-3" /> 5h ago
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="bg-orange-100 p-2 rounded-full">
                                                <Heart className="h-4 w-4 text-orange-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">Impact Milestone</p>
                                                <p className="text-xs text-muted-foreground">You crossed 100kg total donations!</p>
                                                <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                                                    <Clock className="w-3 h-3" /> 1d ago
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <footer className="mt-auto py-8 bg-white border-t text-center">
                    <p className="text-sm text-gray-500">
                        SurplusConnect Dashboard • {new Date().getFullYear()}
                    </p>
                </footer>
            </div>
        )
    }

    // Public Landing Page View
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 md:py-32 bg-gradient-to-br from-green-50 to-blue-50 overflow-hidden">
                <div className="container px-4 md:px-6 mx-auto relative z-10 text-center">

                    <Badge variant="secondary" className="mb-6 px-4 py-1 text-sm bg-white shadow-sm text-green-700 hover:bg-white">
                        ✨ AI-Powered Food Rescue
                    </Badge>

                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
                        Bridge the Gap Between <br className="hidden md:block" />
                        <span className="text-green-600">Surplus</span> and <span className="text-blue-600">Hunger</span>.
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
                        Connect food donors with local NGOs instantly using AI-powered verification.
                        Join our mission to reduce waste and feed communities.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button asChild size="lg" className="h-12 px-8 text-base bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200">
                            <Link href="/donate">
                                Donate Food
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base border-gray-300 hover:bg-white/80 hover:text-gray-900">
                            <Link href="/dashboard/volunteer">
                                Volunteer Now
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Background blobs */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-200/30 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/30 rounded-full blur-[100px]" />
                </div>
            </section>

            {/* Impact Stats */}
            <section className="py-16 bg-white border-y">
                <div className="container px-4 mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="border-none shadow-none text-center bg-transparent">
                            <CardHeader className="pb-2">
                                <div className="mx-auto bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2">
                                    <Utensils className="h-6 w-6 text-green-600" />
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900">500kg</h3>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground font-medium">Food Saved</p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-none text-center bg-transparent">
                            <CardHeader className="pb-2">
                                <div className="mx-auto bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2">
                                    <Heart className="h-6 w-6 text-blue-600" />
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900">120+</h3>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground font-medium">Meals Served</p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-none text-center bg-transparent">
                            <CardHeader className="pb-2">
                                <div className="mx-auto bg-orange-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2">
                                    <Users className="h-6 w-6 text-orange-600" />
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900">15</h3>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground font-medium">Active Volunteers</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-gray-50">
                <div className="container px-4 mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold tracking-tight mb-4">How It Works</h2>
                        <p className="text-muted-foreground text-lg">
                            Our simple AI-driven process makes food rescue effortless.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Step 1 */}
                        <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border">
                            <div className="bg-indigo-50 p-4 rounded-full mb-6">
                                <Camera className="h-8 w-8 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">1. Snap & Verify</h3>
                            <p className="text-muted-foreground">
                                Donors take a photo. Our Gemini AI instantly verifies freshness and categorizes the food.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border">
                            <div className="bg-pink-50 p-4 rounded-full mb-6 relative">
                                <CheckCircle className="h-8 w-8 text-pink-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">2. Local Claim</h3>
                            <p className="text-muted-foreground">
                                Nearby NGOs receive instant alerts and can claim the donation with one click.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border">
                            <div className="bg-amber-50 p-4 rounded-full mb-6">
                                <Truck className="h-8 w-8 text-amber-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">3. Volunteer Delivery</h3>
                            <p className="text-muted-foreground">
                                A volunteer accepts the task, picks up the food, and delivers it to the NGO.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 bg-white border-t text-center">
                <p className="text-sm text-gray-500">
                    Built for SurplusConnect Hackathon • {new Date().getFullYear()}
                </p>
            </footer>
        </div>
    )
}
