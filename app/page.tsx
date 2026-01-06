import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowRight, Camera, CheckCircle, Truck, Heart, Users, Utensils } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-gradient-to-br from-green-50 to-blue-50 overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto relative z-10 text-center">
          <Badge className="mb-6 px-4 py-1 text-sm bg-white shadow-sm text-green-700 hover:scale-105 transition">
            ✨ AI-Powered Food Rescue
          </Badge>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-snug">
            Bridge the Gap Between <br className="hidden md:block" />
            <span className="text-green-600">Surplus</span> and <span className="text-blue-600">Hunger</span>.
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
            Connect food donors with local NGOs instantly using AI-powered verification.
            Join our mission to reduce waste and feed communities.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="h-12 px-8 text-base bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200 transition-all"
            >
              <Link href="/donate" className="flex items-center justify-center gap-2">
                Donate Food
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 px-8 text-base border-gray-300 hover:bg-gray-100 hover:text-gray-900 transition"
            >
              <Link href="/dashboard/volunteer">Volunteer Now</Link>
            </Button>
          </div>
        </div>

        {/* Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-200/30 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/30 rounded-full blur-[100px]" />
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-white border-y">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Food Saved */}
            <Card className="border-none shadow-none text-center bg-transparent hover:scale-105 transition transform">
              <CardHeader className="pb-2">
                <div className="mx-auto bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2">
                  <Utensils className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">500kg</h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 font-medium">Food Saved</p>
              </CardContent>
            </Card>

            {/* Meals Served */}
            <Card className="border-none shadow-none text-center bg-transparent hover:scale-105 transition transform">
              <CardHeader className="pb-2">
                <div className="mx-auto bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2">
                  <Heart className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">120+</h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 font-medium">Meals Served</p>
              </CardContent>
            </Card>

            {/* Active Volunteers */}
            <Card className="border-none shadow-none text-center bg-transparent hover:scale-105 transition transform">
              <CardHeader className="pb-2">
                <div className="mx-auto bg-orange-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">15</h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 font-medium">Active Volunteers</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container px-4 mx-auto max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">How It Works</h2>
            <p className="text-gray-500 text-lg">
              Our simple AI-driven process makes food rescue effortless.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border hover:shadow-lg transition transform hover:-translate-y-1">
              <div className="bg-indigo-50 p-4 rounded-full mb-6">
                <Camera className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Snap & Verify</h3>
              <p className="text-gray-500">
                Donors take a photo. Our Gemini AI instantly verifies freshness and categorizes the food.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border hover:shadow-lg transition transform hover:-translate-y-1">
              <div className="bg-pink-50 p-4 rounded-full mb-6">
                <CheckCircle className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Local Claim</h3>
              <p className="text-gray-500">
                Nearby NGOs receive instant alerts and can claim the donation with one click.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border hover:shadow-lg transition transform hover:-translate-y-1">
              <div className="bg-amber-50 p-4 rounded-full mb-6">
                <Truck className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Volunteer Delivery</h3>
              <p className="text-gray-500">
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
