import { generateObject } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { z } from 'zod'
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { cottage_id, month } = await req.json()

    // Get cottage details for context
    const supabase = await createClient()
    const { data: cottage } = await supabase.from('cottages').select('*').eq('id', cottage_id).single()

    if (!cottage) {
      return NextResponse.json({ error: 'Cottage not found' }, { status: 404 })
    }

    const google = createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    })

    const result = await generateObject({
      model: google('gemini-1.5-flash'),
      schema: z.object({
        suggested_rate: z.number().describe('The suggested daily rate in INR'),
        reason: z.string().describe('Explanation for the suggested rate considering seasonality in Auroville and base rates.'),
      }),
      prompt: `You are a pricing AI for Auroville cottages. 
        Cottage: ${cottage.name}
        Address: ${cottage.address}
        Max Tenants: ${cottage.max_tenants}
        Base Daily Rate: ₹${cottage.rate_daily}
        Target Month: ${month}
        
        Suggest a daily rate for this month based on Auroville's seasonality (e.g., peak season in December/January, low season in May/June). Respond with the suggested rate in INR and a brief explanation.`,
    })

    return NextResponse.json(result.object)
  } catch (error) {
    console.error('AI Suggestion Error:', error)
    return NextResponse.json({ error: 'Failed to suggest rate' }, { status: 500 })
  }
}
