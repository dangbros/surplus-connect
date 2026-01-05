'use client'

import dynamic from 'next/dynamic'
import { VolunteerTask } from '@/actions/volunteer'

// Dynamically import the MapClient component with SSR disabled
// Leaflet requires window object which isn't available on server
const MapClient = dynamic(() => import('./map-client'), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-muted animate-pulse flex items-center justify-center text-muted-foreground">Loading Map...</div>
})

interface VolunteerMapProps {
    tasks: VolunteerTask[]
}

export function VolunteerMap({ tasks }: VolunteerMapProps) {
    return (
        <div className="w-full h-[400px] rounded-lg overflow-hidden border shadow-sm relative z-0">
            <MapClient tasks={tasks} />
        </div>
    )
}
