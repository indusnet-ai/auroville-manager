# Auroville Cottage Manager

A complete production-ready MVP for managing cottage rentals in Auroville.

## Architecture
- **Web App**: Next.js 15 App Router, Tailwind CSS v4, shadcn/ui.
- **Mobile App**: Expo SDK 52, React Native.
- **Database**: Supabase (PostgreSQL with RLS and Exclude constraints).
- **Monorepo**: npm workspaces.

## Getting Started

### 1. Database Setup
1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Go to SQL Editor and run the contents of `supabase/migrations/20240101000000_init.sql`.
3. Optionally, run the contents of `supabase/seed.sql` to add test data.

### 2. Environment Variables
Create a `.env.local` file in `apps/web` and a `.env` file in `apps/mobile` with your Supabase credentials and Gemini API key. Refer to `.env.example`.

### 3. Running the Web App
```bash
npm install
npm run dev:web
```

### 4. Running the Mobile App
```bash
npm install
npm run dev:mobile
```

## Embedding into IndusNetworkAI.in
To embed the web application as an iframe without global headers/footers conflicting with the parent site:
```html
<iframe src="https://your-vercel-domain.com/dashboard" width="100%" height="800px" style="border:none;"></iframe>
```
*Note: The Next.js layout has been designed explicitly to exclude massive headers/footers to make it embed-friendly.*

## Vercel Cron Setup
Add the `vercel.json` file to the root of your Next.js project to configure the daily cron trigger:
```json
{
  "crons": [
    {
      "path": "/api/cron/alerts",
      "schedule": "0 9 * * *"
    }
  ]
}
```
Ensure you set the `CRON_SECRET` and `SUPABASE_SERVICE_ROLE_KEY` in your Vercel Environment Variables.
