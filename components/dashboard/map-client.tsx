'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { VolunteerTask } from '@/actions/volunteer'
import { Button } from '@/components/ui/button'
import { Navigation } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icon in Next.js
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapClientProps {
    tasks: VolunteerTask[]
}

const DEFAULT_CENTER = { lat: 40.7128, lng: -74.0060 } // NYC

export default function MapClient({ tasks }: MapClientProps) {

    // Process tasks: use real coords if available, else mock them near NYC
    // This allows the feature to demo even without database migration
    const mapTasks = tasks.map((task, index) => {
        // Deterministic pseudo-random based on ID to keep markers stable across re-renders
        const pseudoRandom = (seed: string) => {
            let hash = 0;
            for (let i = 0; i < seed.length; i++) {
                hash = ((hash << 5) - hash) + seed.charCodeAt(i);
                hash |= 0;
            }
            return (Math.abs(hash) % 1000) / 1000; // 0..1
        };

        const hasCoords = task.claim.donation.latitude && task.claim.donation.longitude;

        const lat = hasCoords
            ? task.claim.donation.latitude!
            : DEFAULT_CENTER.lat + (pseudoRandom(task.id + 'lat') * 0.1 - 0.05); // +/- 0.05 deg (~5km)

        const lng = hasCoords
            ? task.claim.donation.longitude!
            : DEFAULT_CENTER.lng + (pseudoRandom(task.id + 'lng') * 0.1 - 0.05);

        return {
            ...task,
            renderLat: lat,
            renderLng: lng,
            isMock: !hasCoords
        }
    })

    // Calculate bounds to auto-fit markers
    const bounds = L.latLngBounds(mapTasks.map(t => [t.renderLat, t.renderLng]))

    return (
        <MapContainer
            center={[DEFAULT_CENTER.lat, DEFAULT_CENTER.lng]}
            zoom={12}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
            // @ts-ignore - bounds type is compatible but TS complains
            bounds={bounds.isValid() ? bounds : undefined}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {mapTasks.map((task) => (
                <Marker
                    key={task.id}
                    position={[task.renderLat, task.renderLng]}
                >
                    <Popup>
                        <div className="p-1 min-w-[200px]">
                            <h3 className="font-bold text-sm mb-1">{task.claim.donation.donor?.organization_name}</h3>
                            <p className="text-xs text-gray-600 mb-1">
                                {task.claim.donation.food_category} • {task.claim.donation.weight_kg} kg
                            </p>
                            {task.claim.donation.pickup_address && (
                                <p className="text-xs text-gray-500 mb-2 truncate max-w-[200px]" title={task.claim.donation.pickup_address}>
                                    📍 {task.claim.donation.pickup_address}
                                </p>
                            )}
                            {task.isMock && (
                                <p className="text-[10px] text-amber-600 italic mb-2">
                                    (Simulated Location)
                                </p>
                            )}
                            <Button
                                size="sm"
                                className="w-full h-8 text-xs"
                                asChild
                            >
                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${task.renderLat},${task.renderLng}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Navigation className="h-3 w-3 mr-1" />
                                    Navigate
                                </a>
                            </Button>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    )
}
