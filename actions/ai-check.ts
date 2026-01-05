'use server'

import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function analyzeFoodImage(formData: FormData) {
    const file = formData.get('image') as File

    if (!file) {
        return { error: 'No image provided' }
    }

    try {
        const arrayBuffer = await file.arrayBuffer()
        const base64Image = Buffer.from(arrayBuffer).toString('base64')


        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' })

        const prompt = `You are a Food Safety Inspector. Analyze this image. 
    Return valid, strictly valid JSON only suitable for unnecessary parsing (no markdown code blocks, just the raw JSON object).
    The JSON structure must be: 
    { 
      "is_safe": boolean, 
      "freshness_score": number (1-10), 
      "detected_category": string (Enum: 'Cooked', 'Raw', 'Packaged'), 
      "reasoning": string 
    }.`

        try {
            const result = await model.generateContent([
                prompt,
                {
                    inlineData: {
                        data: base64Image,
                        mimeType: file.type,
                    },
                },
            ])

            const response = await result.response
            const text = response.text()

            // Clean up markdown block if present ( Gemini sometimes wraps in ```json ... ```)
            const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim()

            try {
                const jsonResponse = JSON.parse(cleanedText)
                return jsonResponse
            } catch (parseError) {
                console.error("AI Response Parsing Error:", parseError, "Raw text:", text)
                return { error: 'Failed to parse AI response', raw: text }
            }
        } catch (apiError: any) {
            console.error('Gemini API Error:', apiError)
            if (apiError.status === 429 || apiError.message?.includes('429')) {
                return { error: 'AI Service is busy (Rate Limit Exceeded). Please try again in a minute.' }
            }
            return { error: 'AI Service currently unavailable.' }
        }

    } catch (error) {
        console.error('AI Analysis Error:', error)
        return { error: 'Failed to analyze image' }
    }
}
