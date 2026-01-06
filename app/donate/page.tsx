"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Heart, Users, Utensils } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ---------------- Navbar ---------------- */}
      <header className="sticky top-0 z-50 bg-background shadow-md">
        <nav className="container mx-auto flex items-center justify-between py-4 px-6">
          <Link href="/" className="text-2xl font-bold text-yellow-500">
            SurplusConnect
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/donate" className="text-yellow-600 font-medium hover:underline">
              Donate
            </Link>
            <Link href="/dashboard/volunteer" className="text-yellow-600 font-medium hover:underline">
              Volunteer
            </Link>
            <Link href="/about" className="text-yellow-600 font-medium hover:underline">
              About
            </Link>
          </div>
        </nav>
      </header>

      {/* ---------------- Hero ---------------- */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-yellow-50 to-yellow-100 overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <Badge className="mb-6 bg-yellow-100 text-yellow-700 shadow-sm">✨ AI-Powered Food Rescue</Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6">
            Bridge the Gap Between <span className="text-yellow-600">Surplus</span> and Hunger
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-700 mb-10">
            Connect food donors with local NGOs instantly using AI-powered verification. Reduce waste and feed communities.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" variant="warning">
              <Link href="/donate">Donate Food</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/dashboard/volunteer">Volunteer Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ---------------- About Section ---------------- */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">About SurplusConnect</h2>
          <p className="text-gray-700 mb-8">
            SurplusConnect is a smart food redistribution platform connecting donors, NGOs, and volunteers.
            Our AI-powered system ensures fast, safe, and efficient delivery of surplus food to those who need it most.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <Card className="shadow-lg hover:shadow-xl transition-shadow p-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="h-6 w-6 text-yellow-500" /> Food Saved
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-bold">500kg+</p>
                <p className="text-gray-600">Surplus food rescued</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow p-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-6 w-6 text-yellow-500" /> Meals Served
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-bold">120+</p>
                <p className="text-gray-600">Healthy meals delivered</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow p-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-yellow-500" /> Volunteers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-bold">15+</p>
                <p className="text-gray-600">Active community members</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ---------------- Footer ---------------- */}
      <footer className="py-8 bg-gray-50 border-t text-center text-gray-600">
        Built for SurplusConnect Hackathon • {new Date().getFullYear()}
      </footer>
    </div>
  )
}
