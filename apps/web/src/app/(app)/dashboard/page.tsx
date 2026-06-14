import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IndianRupee, Percent, CalendarClock, Building } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: cottages } = await supabase.from('cottages').select('*')
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, cottages(name)')
    .in('status', ['booked', 'checked_in'])
  
  // Calculate KPIs
  const thisMonthRent = bookings?.reduce((acc, b) => acc + (Number(b.rate) || 0), 0) || 0
  const pendingRent = bookings?.reduce((acc, b) => acc + Math.max(0, (Number(b.rate) || 0) - (Number(b.advance_paid) || 0)), 0) || 0
  
  const totalCottages = cottages?.length || 0
  const occupiedCottages = bookings?.filter(b => b.status === 'checked_in').length || 0
  const occupancy = totalCottages > 0 ? Math.round((occupiedCottages / totalCottages) * 100) : 0

  const nextCheckout = bookings?.filter(b => b.status === 'checked_in').sort((a, b) => new Date(a.checkout_date).getTime() - new Date(b.checkout_date).getTime())[0]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month Rent</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{thisMonthRent}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Rent</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{pendingRent}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupancy}%</div>
            <p className="text-xs text-muted-foreground">{occupiedCottages} of {totalCottages} occupied</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Checkout</CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nextCheckout ? new Date(nextCheckout.checkout_date).toLocaleDateString() : 'None'}</div>
            {nextCheckout && <p className="text-xs text-muted-foreground">{nextCheckout.guest_name}</p>}
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-semibold mt-8">Cottages Status</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cottages?.map(cottage => {
          const activeBooking = bookings?.find(b => b.cottage_id === cottage.id && b.status === 'checked_in')
          return (
            <Card key={cottage.id} className={activeBooking ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-green-500'}>
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between">
                  <span>{cottage.name}</span>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activeBooking ? (
                  <div>
                    <p className="font-medium text-red-600">Occupied by {activeBooking.guest_name}</p>
                    <p className="text-sm text-muted-foreground">Checkout: {new Date(activeBooking.checkout_date).toLocaleDateString()}</p>
                  </div>
                ) : (
                  <p className="font-medium text-green-600">Vacant</p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
