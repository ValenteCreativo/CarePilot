# Database Setup Instructions (Neon Postgres)

## Current Status
❌ `.env.local` has placeholder DATABASE_URL  
✅ Schema files ready (`src/db/schema.ts`)  
✅ Seed script ready (`scripts/seed.ts`)

## Steps to Connect Your Neon Database

### 1. Get Your Neon Connection String

Go to [Neon Console](https://console.neon.tech/) → your project → Connection Details

Copy the connection string. It should look like:
```
postgresql://username:password@ep-xxxx-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### 2. Update `.env.local`

Replace the placeholder in `.env.local`:

```bash
# Before (placeholder):
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# After (your real Neon URL):
DATABASE_URL=postgresql://your-username:your-password@ep-xxxx-xxxx.region.aws.neon.tech/neondb?sslmode=require
```

### 3. Push Database Schema

This creates all tables (users, cases, actions, messages, etc.):

```bash
npx drizzle-kit push
```

**Expected output:**
```
✓ Pulling schema from database...
✓ Changes applied successfully
```

**Tables created:**
- `users` - User accounts (email, password, phone)
- `cases` - Care cases  
- `plans` - Generated care plans
- `actions` - Autonomous actions (reminders, tasks)
- `messages` - WhatsApp conversation history
- `checkins` - Progress tracking
- `llm_runs` - LLM execution logs
- `llm_evals` - Quality metrics
- `human_feedback` - User feedback

### 4. Seed Demo User

This creates the test account:

```bash
npm run db:seed
```

**Demo credentials:**
- Email: `demo@carepilot.ai`
- Password: `carepilot-demo`

**Expected output:**
```
Seeded demo user: demo@carepilot.ai password: carepilot-demo
```

### 5. Test Login

Start dev server and try logging in:

```bash
npm run dev
```

Then go to: http://localhost:3000/login

Or test with the E2E script:
```bash
npx tsx scripts/test-login-e2e.ts
```

---

## Troubleshooting

### Error: "getaddrinfo EAI_AGAIN host"
**Cause:** DATABASE_URL still has placeholder values  
**Fix:** Update `.env.local` with your real Neon URL

### Error: "Connection timeout"
**Cause:** Firewall or incorrect region  
**Fix:** Check Neon console for correct connection string

### Error: "SSL connection error"
**Cause:** Missing `?sslmode=require` in URL  
**Fix:** Add `?sslmode=require` at the end of your DATABASE_URL

### Error: "Seed user already exists"
**Cause:** User was already seeded  
**Fix:** This is normal! User `demo@carepilot.ai` is already in DB. Just login.

---

## Vercel Deployment

When deploying to Vercel, add the same DATABASE_URL to:

Vercel Dashboard → Project → Settings → Environment Variables

```
DATABASE_URL = postgresql://your-username:your-password@ep-xxxx...
```

Then redeploy. The schema will already exist (no need to push again).

---

## Quick Setup Checklist

- [ ] Get Neon connection string from console
- [ ] Update `.env.local` with real DATABASE_URL
- [ ] Run `npx drizzle-kit push` (creates tables)
- [ ] Run `npm run db:seed` (creates demo user)
- [ ] Test login at http://localhost:3000/login
- [ ] Login with `demo@carepilot.ai` / `carepilot-demo`

✅ Done! Database connected and ready.
