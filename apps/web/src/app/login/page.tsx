import { login, signup } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default async function LoginPage(props: { searchParams: Promise<{ message?: string }> }) {
  const searchParams = await props.searchParams
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto min-h-screen py-12">
      <h1 className="text-3xl font-bold text-center mb-8 text-primary">Auroville Manager</h1>
      
      {searchParams?.message && (
        <p className="mb-8 p-4 bg-red-100 text-red-600 font-medium text-center rounded-md border border-red-200">
          {searchParams.message}
        </p>
      )}

      {/* Login Form */}
      <form action={login} className="animate-in flex flex-col w-full justify-center gap-2 text-foreground mb-8 border-b pb-12 border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-center">Existing Users</h2>
        <Label className="text-md" htmlFor="email">Email</Label>
        <Input className="mb-6" name="email" placeholder="you@example.com" required />
        
        <Label className="text-md" htmlFor="password">Password</Label>
        <Input className="mb-6" type="password" name="password" placeholder="••••••••" required />
        
        <Button type="submit">Sign In</Button>
      </form>

      {/* Signup Form */}
      <form action={signup} className="animate-in flex flex-col w-full justify-center gap-2 text-foreground">
        <h2 className="text-xl font-semibold mb-4 text-center">New Users</h2>
        <Label className="text-md" htmlFor="email-signup">Email</Label>
        <Input id="email-signup" className="mb-6" name="email" placeholder="new@example.com" required />
        
        <Label className="text-md" htmlFor="password-signup">Password</Label>
        <Input id="password-signup" className="mb-6" type="password" name="password" placeholder="••••••••" required />
        
        <Button variant="outline" type="submit">Create Account</Button>
      </form>
    </div>
  )
}
