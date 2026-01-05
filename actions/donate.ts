'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const donationSchema = z.object({
    food_category: z.enum(['Cooked', 'Raw', 'Packaged']),
    weight_kg: z.coerce.number().positive(),
    expiry_hours: z.coerce.number().positive(),
    pickup_instructions: z.string().min(1, 'Pickup instructions are required'),
    image: z.instanceof(File).refine((file) => file.size > 0, 'Image is required'),
})

export async function submitDonation(prevState: any, formData: FormData) {
    const supabase = await createClient()

    // Validate fields
    const validatedFields = donationSchema.safeParse({
        food_category: formData.get('food_category'),
        weight_kg: formData.get('weight_kg'),
        expiry_hours: formData.get('expiry_hours'),
        pickup_instructions: formData.get('pickup_instructions'),
        image: formData.get('image'),
    })

    if (!validatedFields.success) {
        return {
            error: 'Validation failed',
            issues: validatedFields.error.flatten().fieldErrors,
        }
    }

    const { food_category, weight_kg, expiry_hours, pickup_instructions, image } =
        validatedFields.data

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

        // Insert into database
        const { error: insertError } = await supabase.from('donations').insert({
            donor_id: user.id,
            food_category,
            weight_kg,
            pickup_instructions,
            expiry_at: expiryDate.toISOString(),
            image_url: publicUrl,
            status: 'AVAILABLE',
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
