import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Home, HomeIcon, CalendarDays, Wallet, User } from 'lucide-react'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  return (
    <div className="flex h-screen bg-muted/20">
      <aside className="w-16 sm:w-64 bg-background border-r flex flex-col justify-between">
        <div className="flex flex-col gap-4 p-4">
          <div className="hidden sm:block font-bold text-xl text-primary mb-4">Auroville</div>
          <nav className="flex flex-col gap-2">
            <Link href="/dashboard" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md">
              <HomeIcon className="w-5 h-5" />
              <span className="hidden sm:block">Dashboard</span>
            </Link>
            <Link href="/cottages" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md">
              <Home className="w-5 h-5" />
              <span className="hidden sm:block">Cottages</span>
            </Link>
            <Link href="/calendar" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md">
              <CalendarDays className="w-5 h-5" />
              <span className="hidden sm:block">Calendar</span>
            </Link>
            <Link href="/bookings" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md">
              <CalendarDays className="w-5 h-5" />
              <span className="hidden sm:block">Bookings</span>
            </Link>
            <Link href="/accounts" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md">
              <Wallet className="w-5 h-5" />
              <span className="hidden sm:block">Accounts</span>
            </Link>
          </nav>
        </div>
        <div className="p-4 border-t">
          <Link href="/profile" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md">
            <User className="w-5 h-5" />
            <span className="hidden sm:block">Profile</span>
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-4 sm:p-8">
        {children}
      </main>
    </div>
  )
}
