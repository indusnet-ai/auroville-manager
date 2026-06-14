import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function CottagesPage() {
  const supabase = await createClient()
  const { data: cottages } = await supabase.from('cottages').select('*')

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Cottages</h1>
        <Link href="/cottages/new">
          <Button><Plus className="w-4 h-4 mr-2" /> Add Cottage</Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cottages?.map(cottage => (
          <Card key={cottage.id}>
            <CardHeader>
              <CardTitle>{cottage.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Address: {cottage.address}</p>
              <p>Max Tenants: {cottage.max_tenants}</p>
              <div className="flex gap-4 mt-4">
                <span>Daily: ₹{cottage.rate_daily}</span>
                <span>Weekly: ₹{cottage.rate_weekly}</span>
                <span>Monthly: ₹{cottage.rate_monthly}</span>
              </div>
            </CardContent>
          </Card>
        ))}
        {cottages?.length === 0 && <p className="text-muted-foreground">No cottages found. Add one to get started.</p>}
      </div>
    </div>
  )
}
