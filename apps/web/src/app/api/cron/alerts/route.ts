import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@auroville/db'

export async function GET(req: Request) {
  // Verify Vercel Cron secret
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Bypass RLS to scan all bookings
  )
  
  const today = new Date().toISOString().split('T')[0]
  
  const { data: checkoutsToday } = await supabase
    .from('bookings')
    .select('*, cottages(name)') // In a real app we would join auth.users or profiles for the email
    .eq('checkout_date', today)
    .eq('status', 'checked_in')

  console.log(`Found ${checkoutsToday?.length || 0} checkouts for today.`)
  
  // Here you would integrate Resend or SendGrid to email the owners
  // checkoutsToday.forEach(booking => sendEmail(owner_email, ...))

  return NextResponse.json({ success: true, checkoutsToday: checkoutsToday?.length })
}
