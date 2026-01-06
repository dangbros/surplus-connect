'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, MapPin, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

// Fix Leaflet's default icon path issues
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
})
L.Marker.prototype.options.icon = DefaultIcon

interface LocationData {
    lat: number
    lng: number
    address: string
}

interface OSMPickerProps {
    onLocationSelect: (location: LocationData) => void
    initialAddress?: string
}

// Component to handle map clicks and drags
function DraggableMarker({
    position,
    onDragEnd
}: {
    position: L.LatLngExpression,
    onDragEnd: (e: any) => void
}) {
    const markerRef = useRef<any>(null)

    // Update marker position if prop changes
    useEffect(() => {
        if (markerRef.current) {
            markerRef.current.setLatLng(position)
        }
    }, [position])

    const eventHandlers = useMemo(
        () => ({
            dragend(e: any) {
                onDragEnd(e)
            },
        }),
        [onDragEnd],
    )

    return (
        <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef}
        />
    )
}

// Component to recenter map when position changes
function MapRecenter({ position }: { position: L.LatLngExpression }) {
    const map = useMapEvents({})
    useEffect(() => {
        map.flyTo(position, map.getZoom())
    }, [position, map])
    return null
}

export default function OSMPicker({ onLocationSelect, initialAddress }: OSMPickerProps) {
    const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null)
    const [searchQuery, setSearchQuery] = useState(initialAddress || '')
    const [isSearching, setIsSearching] = useState(false)
    const [isLoadingLocation, setIsLoadingLocation] = useState(false)

    // Set default view to NYC if no position
    const defaultPosition = { lat: 40.7128, lng: -74.0060 }

    useEffect(() => {
        // If initial address is provided but no position, try to geocode it on mount
        if (initialAddress && !position) {
            handleSearch(initialAddress) // Trigger search
        }
    }, []) // Run once on mount

    const reverseGeocode = async (lat: number, lng: number) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            )
            const data = await response.json()
            if (data && data.display_name) {
                setSearchQuery(data.display_name)
                onLocationSelect({ lat, lng, address: data.display_name })
            }
        } catch (error) {
            console.error('Reverse geocoding failed:', error)
        }
    }

    const handleSearch = async (query?: string) => {
        const q = query || searchQuery
        if (!q) return

        setIsSearching(true)
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`
            )
            const data = await response.json()

            if (data && data.length > 0) {
                const newLat = parseFloat(data[0].lat)
                const newLng = parseFloat(data[0].lon)
                const newPos = { lat: newLat, lng: newLng }

                setPosition(newPos)
                // If it was a search, use the display_name from result or keep user query?
                // Usually better to update with the official formatted address
                setSearchQuery(data[0].display_name)
                onLocationSelect({ lat: newLat, lng: newLng, address: data[0].display_name })
            } else {
                toast.error('Location not found')
            }
        } catch (error) {
            toast.error('Search failed')
        } finally {
            setIsSearching(false)
        }
    }

    const handleUseMyLocation = () => {
        setIsLoadingLocation(true)
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords
                    setPosition({ lat: latitude, lng: longitude })
                    reverseGeocode(latitude, longitude)
                    setIsLoadingLocation(false)
                },
                (err) => {
                    console.error(err)
                    toast.error('Could not get your location')
                    setIsLoadingLocation(false)
                }
            )
        } else {
            toast.error('Geolocation is not supported by your browser')
            setIsLoadingLocation(false)
        }
    }

    const handleMarkerDragEnd = (e: any) => {
        const marker = e.target
        const newPos = marker.getLatLng()
        setPosition(newPos)
        reverseGeocode(newPos.lat, newPos.lng)
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search address or use map..."
                    className="flex-1"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
                />
                <Button type="button" variant="outline" onClick={() => handleSearch()} disabled={isSearching}>
                    {isSearching ? <Loader2 className="animate-spin" /> : <Search className="w-4 h-4" />}
                </Button>
                <Button type="button" variant="secondary" onClick={handleUseMyLocation} disabled={isLoadingLocation}>
                    {isLoadingLocation ? <Loader2 className="animate-spin" /> : <MapPin className="w-4 h-4" />}
                    <span className="sr-only sm:not-sr-only sm:ml-2">My Location</span>
                </Button>
            </div>

            <div className="h-[300px] w-full rounded-md border overflow-hidden relative z-0">
                <MapContainer
                    center={position || defaultPosition}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <DraggableMarker
                        position={position || defaultPosition}
                        onDragEnd={handleMarkerDragEnd}
                    />
                    {position && <MapRecenter position={position} />}
                </MapContainer>

                {!position && (
                    <div className="absolute inset-0 bg-black/5 flex items-center justify-center pointer-events-none z-[400]">
                        <p className="text-sm text-gray-500 bg-white/80 px-2 py-1 rounded">
                            Search or drag marker to set location
                        </p>
                    </div>
                )}
            </div>
            {position && (
                <p className="text-xs text-muted-foreground text-center">
                    Drag the marker to pinpoint exact location
                </p>
            )}
        </div>
    )
}
