// @ts-nocheck
import { createClient } from '@/utils/supabase/server'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

export default async function AccountsPage() {
  const supabase = await createClient()
  
  // Ledger: Income (from checked_out bookings) + Expenses
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, cottages(name)')
    .eq('status', 'checked_out')
    
  const { data: expenses } = await supabase
    .from('expenses')
    .select('*, cottages(name)')

  const totalIncome = bookings?.reduce((sum, b) => sum + Number((b as any).rate), 0) || 0
  const totalExpenses = expenses?.reduce((sum, e) => sum + Number((e as any).amount), 0) || 0
  const netProfit = totalIncome - totalExpenses

  // Combine into a single ledger array
  const ledger = [
    ...(bookings?.map(b => ({
      id: b.id,
      date: b.checkout_date,
      type: 'Income',
      category: 'Rent',
      description: `Booking - ${b.guest_name} (${(b.cottages as any)?.name})`,
      amount: Number(b.rate),
    })) || []),
    ...(expenses?.map(e => ({
      id: e.id,
      date: e.expense_date,
      type: 'Expense',
      category: e.category,
      description: e.cottages ? `Expense (${(e.cottages as any).name})` : 'General Expense',
      amount: -Number(e.amount), // negative for expenses
    })) || []),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Accounts & P&L</h1>
        <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export Excel</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{totalIncome.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₹{totalExpenses.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₹{netProfit.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-semibold mt-8">General Ledger</h2>
      <div className="border rounded-md bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount (₹)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ledger.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${entry.type === 'Income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {entry.type}
                  </span>
                </TableCell>
                <TableCell>{entry.category}</TableCell>
                <TableCell>{entry.description}</TableCell>
                <TableCell className={`text-right font-medium ${entry.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
                  {entry.type === 'Income' ? '+' : ''}{entry.amount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
            {ledger.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">No transactions found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
