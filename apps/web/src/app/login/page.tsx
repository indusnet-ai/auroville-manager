import { login, signup } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default async function LoginPage(props: { searchParams: Promise<{ message?: string }> }) {
  const searchParams = await props.searchParams
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto min-h-screen">
      <form action={login} className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
        <h1 className="text-3xl font-bold text-center mb-8 text-primary">Auroville Manager</h1>
        
        <Label className="text-md" htmlFor="email">
          Email
        </Label>
        <Input
          className="mb-6"
          name="email"
          placeholder="you@example.com"
          required
        />
        
        <Label className="text-md" htmlFor="password">
          Password
        </Label>
        <Input
          className="mb-6"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        
        <Button type="submit" className="mb-2">
          Sign In
        </Button>
        <Button formAction={signup} variant="outline" className="mb-2">
          Sign Up
        </Button>

        {searchParams?.message && (
          <p className="mt-4 p-4 bg-red-100 text-red-600 font-medium text-center rounded-md border border-red-200">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  )
}
