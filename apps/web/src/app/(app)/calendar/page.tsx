import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isWithinInterval, isSameDay } from 'date-fns'

export default async function CalendarPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const params = await searchParams
  const supabase = await createClient()
  
  const { data: cottages } = await supabase.from('cottages').select('*')
  const { data: bookings } = await supabase.from('bookings').select('*').neq('status', 'cancelled')

  const targetDate = params?.month ? new Date(params.month) : new Date()
  const monthStart = startOfMonth(targetDate)
  const monthEnd = endOfMonth(targetDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Calendar - {format(targetDate, 'MMMM yyyy')}</h1>
      </div>

      <div className="space-y-8">
        {cottages?.map(cottage => {
          const cottageBookings = bookings?.filter(b => b.cottage_id === cottage.id) || []
          
          return (
            <Card key={cottage.id}>
              <CardHeader>
                <CardTitle>{cottage.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-semibold text-sm py-2">{day}</div>
                  ))}
                  
                  {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                    <div key={`empty-${i}`} className="p-2 h-24 bg-muted/20 rounded-md" />
                  ))}
                  
                  {daysInMonth.map(day => {
                    const booking = cottageBookings.find(b => 
                      isWithinInterval(day, { start: new Date(b.checkin_date), end: new Date(b.checkout_date) })
                    )
                    const isCheckout = booking && isSameDay(day, new Date(booking.checkout_date))
                    
                    let bgClass = "bg-green-100 dark:bg-green-900/20"
                    let statusText = "Vacant"
                    
                    if (booking) {
                      if (isCheckout) {
                        bgClass = "bg-yellow-100 dark:bg-yellow-900/20 border-yellow-400 border"
                        statusText = "Checkout"
                      } else {
                        bgClass = "bg-red-100 dark:bg-red-900/20"
                        statusText = booking.guest_name
                      }
                    }

                    return (
                      <div key={day.toISOString()} className={`p-2 h-24 rounded-md flex flex-col justify-between ${bgClass}`}>
                        <span className="text-sm font-medium text-foreground">{format(day, 'd')}</span>
                        <span className="text-xs truncate text-foreground">{statusText}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
