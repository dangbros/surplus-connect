'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, Medal, Award, User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LeaderboardProps {
    users: {
        id: string
        full_name: string
        points: number
        lifetime_deliveries: number
    }[]
    currentUserId?: string
}

export function Leaderboard({ users, currentUserId }: LeaderboardProps) {
    if (!users || users.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-amber-500" />
                        Top Volunteers
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground text-center py-4">No data yet. Be the first!</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    Top Volunteers
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {users.map((user, index) => {
                    const isTop3 = index < 3
                    const isCurrentUser = user.id === currentUserId

                    return (
                        <div
                            key={user.id}
                            className={cn(
                                "flex items-center justify-between p-2 rounded-lg transition-colors border",
                                isCurrentUser ? "bg-green-50 border-green-200" : "bg-card border-transparent hover:bg-muted/50"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm",
                                    index === 0 ? "bg-yellow-100 text-yellow-700" :
                                        index === 1 ? "bg-gray-100 text-gray-700" :
                                            index === 2 ? "bg-orange-100 text-orange-700" :
                                                "bg-muted text-muted-foreground"
                                )}>
                                    {index + 1}
                                </div>
                                <div>
                                    <p className={cn("font-medium text-sm flex items-center gap-2", isCurrentUser && "text-green-700")}>
                                        {user.full_name || 'Anonymous Volunteer'}
                                        {index === 0 && <Medal className="h-3 w-3 text-yellow-500" />}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{user.lifetime_deliveries} deliveries</p>
                                </div>
                            </div>
                            <div className="font-mono font-bold text-sm text-green-600">
                                {user.points ?? 0} pts
                            </div>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    )
}
