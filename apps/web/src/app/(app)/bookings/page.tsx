import { createClient } from '@/utils/supabase/server'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function BookingsPage() {
  const supabase = await createClient()
  const { data: bookings } = await supabase.from('bookings').select('*, cottages(name)').order('checkin_date', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Bookings</h1>
        <Link href="/bookings/new">
          <Button><Plus className="w-4 h-4 mr-2" /> New Booking</Button>
        </Link>
      </div>

      <div className="border rounded-md bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guest</TableHead>
              <TableHead>Cottage</TableHead>
              <TableHead>Check In</TableHead>
              <TableHead>Check Out</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total Rent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings?.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="font-medium">{b.guest_name}</TableCell>
                <TableCell>{b.cottages?.name as string}</TableCell>
                <TableCell>{new Date(b.checkin_date).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(b.checkout_date).toLocaleDateString()}</TableCell>
                <TableCell className="capitalize">{b.status.replace('_', ' ')}</TableCell>
                <TableCell>₹{b.rate}</TableCell>
              </TableRow>
            ))}
            {bookings?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">No bookings found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
