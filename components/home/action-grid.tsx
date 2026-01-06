import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, MapPin, Search, Utensils, History } from 'lucide-react'
import { ROLES } from '@/lib/constants'

interface ActionGridProps {
    role?: string | null
    userName?: string | null
}

export function ActionGrid({ role }: ActionGridProps) {
    const showAll = !role || !Object.values(ROLES).includes(role as any)

    return (
        <section className="py-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                Quick Actions
            </h2>
            <div className="grid grid-cols-1 gap-6">

                {(role === ROLES.DONOR || showAll) && (
                    <Card className="hover:shadow-lg transition-all duration-300 border-green-100 bg-gradient-to-br from-white to-green-50">
                        <CardHeader>
                            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
                                <Utensils className="w-6 h-6 text-green-600" />
                            </div>
                            <CardTitle className="text-xl">Donate Food</CardTitle>
                            <CardDescription>
                                Have surplus food? List it in seconds for verification.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="w-full bg-green-600 hover:bg-green-700 h-11 text-base shadow-md hover:shadow-lg transition-all">
                                <Link href="/donate">
                                    Start New Donation <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                        <CardFooter>
                            <Button variant="ghost" className="w-full text-muted-foreground hover:text-green-700 text-sm" asChild>
                                <Link href="#">
                                    <History className="mr-2 h-4 w-4" /> View Donation History
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                )}

                {(role === ROLES.NGO || showAll) && (
                    <Card className="hover:shadow-lg transition-all duration-300 border-blue-100 bg-gradient-to-br from-white to-blue-50">
                        <CardHeader>
                            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
                                <Search className="w-6 h-6 text-blue-600" />
                            </div>
                            <CardTitle className="text-xl">Find Donations</CardTitle>
                            <CardDescription>
                                Browse verified food donations available near you.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-base shadow-md hover:shadow-lg transition-all">
                                <Link href="/dashboard/ngo">
                                    Browse Available Food <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {(role === ROLES.VOLUNTEER || showAll) && (
                    <Card className="hover:shadow-lg transition-all duration-300 border-amber-100 bg-gradient-to-br from-white to-amber-50">
                        <CardHeader>
                            <div className="bg-amber-100 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
                                <MapPin className="w-6 h-6 text-amber-600" />
                            </div>
                            <CardTitle className="text-xl">Volunteer Tasks</CardTitle>
                            <CardDescription>
                                Help deliver food from donors to NGOs.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="w-full bg-amber-600 hover:bg-amber-700 h-11 text-base shadow-md hover:shadow-lg transition-all">
                                <Link href="/dashboard/volunteer">
                                    Open Task Map <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </section>
    )
}
