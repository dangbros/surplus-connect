'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const donationSchema = z.object({
    food_category: z.enum(['Cooked', 'Raw', 'Packaged']),
    weight_kg: z.coerce.number().positive(),
    expiry_hours: z.coerce.number().positive(),
    pickup_instructions: z.string().min(1, 'Pickup instructions are required'),
    pickup_address: z.string().optional(),
    freshness_score: z.coerce.number().optional(),
    ai_notes: z.string().optional(),
    can_deliver: z.boolean().optional(),
    image: z.instanceof(File).refine((file) => file.size > 0, 'Image is required'),
})

// Helper to geocode address
async function getCoordinates(address: string) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                address
            )}`,
            {
                headers: {
                    'User-Agent': 'SurplusConnect/1.0', // Required by Nominatim
                },
            }
        )
        const data = await response.json()
        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lon: parseFloat(data[0].lon),
            }
        }
    } catch (error) {
        console.error('Geocoding error:', error)
    }
    return null
}

export async function submitDonation(prevState: any, formData: FormData) {
    const supabase = await createClient()

    // Validate fields
    const validatedFields = donationSchema.safeParse({
        food_category: formData.get('food_category'),
        weight_kg: formData.get('weight_kg'),
        expiry_hours: formData.get('expiry_hours'),
        pickup_instructions: formData.get('pickup_instructions'),
        pickup_address: formData.get('pickup_address') || undefined,
        freshness_score: formData.get('freshness_score') || undefined,
        ai_notes: formData.get('ai_notes') || undefined,
        can_deliver: formData.get('can_deliver') === 'true', // Transform string to boolean
        image: formData.get('image'),
    })

    if (!validatedFields.success) {
        return {
            error: 'Validation failed',
            issues: validatedFields.error.flatten().fieldErrors,
        }
    }

    const {
        food_category,
        weight_kg,
        expiry_hours,
        pickup_instructions,
        pickup_address,
        freshness_score,
        ai_notes,
        can_deliver,
        image
    } = validatedFields.data

    try {
        // Get current user
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user) {
            return { error: 'Unauthorized' }
        }

        // Upload image
        const fileExt = image.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
            .from('food-images')
            .upload(fileName, image)

        if (uploadError) {
            console.error('Upload Error:', uploadError)
            return { error: `Failed to upload image: ${uploadError.message}` }
        }

        // Get public URL
        const {
            data: { publicUrl },
        } = supabase.storage.from('food-images').getPublicUrl(fileName)

        // Calculate expiry
        const expiryDate = new Date()
        expiryDate.setHours(expiryDate.getHours() + expiry_hours)

        // Geocode Address or Use Provided Coordinates
        let latitude = null
        let longitude = null

        const formLat = formData.get('latitude')
        const formLng = formData.get('longitude')

        if (formLat && formLng) {
            latitude = parseFloat(formLat.toString())
            longitude = parseFloat(formLng.toString())
        } else if (pickup_address) {
            // Fallback to server-side geocoding
            const coords = await getCoordinates(pickup_address)
            if (coords) {
                latitude = coords.lat
                longitude = coords.lon
            }
        }

        // Insert into database
        const { error: insertError } = await supabase.from('donations').insert({
            donor_id: user.id,
            food_category,
            weight_kg,
            pickup_instructions,
            pickup_address,
            freshness_score,
            ai_notes,
            can_deliver: can_deliver || false,
            latitude,
            longitude,
            expiry_at: expiryDate.toISOString(),
            image_url: publicUrl,
            status: 'AVAILABLE',
            is_verified: !!freshness_score,
        })

        if (insertError) {
            console.error('Insert Error:', insertError)
            return { error: 'Failed to save donation' }
        }

        return { success: true, message: 'Donation submitted successfully' }
    } catch (error) {
        console.error('Unexpected Error:', error)
        return { error: 'An unexpected error occurred' }
    }
}
