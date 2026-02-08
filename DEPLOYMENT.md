# CarePilot v2.0 - Deployment Guide

## Environment Variables (Vercel)

Add these in Vercel Dashboard → Settings → Environment Variables:

```bash
# Database (Neon Postgres)
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Google Gemini (primary LLM - DeepMind sponsor)
GOOGLE_AI_API_KEY=your_google_gemini_api_key

# Opik (LLM observability - hackathon sponsor)
OPIK_API_KEY=your_opik_api_key
OPIK_PROJECT_NAME=carepilot

# Twilio (SMS + WhatsApp)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_FROM_NUMBER=+1234567890
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# Optional
NEXT_PUBLIC_OPIK_PROJECT_URL=https://www.comet.com/opik/your-project
```

## Twilio WhatsApp Webhook Setup

1. Go to Twilio Console → Messaging → Try it out → Send a WhatsApp message
2. Your sandbox number: `+1 415 523 8886`
3. Join code: `join four-mission`
4. Set webhook URL: `https://your-deployment.vercel.app/api/whatsapp`
5. Method: `POST`
6. Ensure `TWILIO_AUTH_TOKEN` is set so signature verification passes (required in production).
7. In Vercel, use the public HTTPS URL (signature verification uses the full request URL).

## Cron Job (Vercel)

Configured in `vercel.json`:
- Path: `/api/actions/cron`
- Schedule: every 10 minutes (`*/10 * * * *`)
- Auto-executes approved actions that are due

## Database Schema

Run migrations after first deploy:
```bash
npm run db:push
```

This creates:
- users
- cases
- plans
- actions
- checkins
- llm_runs
- llm_evals
- human_feedback

## Demo Flow

### For Judges (Web Dashboard)

1. Visit: `https://your-deployment.vercel.app`
2. Click "Create New Case"
3. Fill context form
4. Generate Plan → see Opik tracing
5. Visit `/case/[id]/actions` → approve actions
6. Wait for cron → SMS sent via Twilio
7. Visit `/case/[id]/quality` → see LLM metrics

### For Users (WhatsApp Bot)

1. Message `+1 415 523 8886` with: `join four-mission`
2. Bot starts conversational onboarding
3. Describe patient + situation (free text)
4. Bot generates plan + auto-approves actions
5. Receive SMS reminders automatically
6. Commands:
   - `plan` → see 7-day plan
   - `status` → next 3 actions
   - `update [text]` → adjust plan
   - `help` → command list

## Hackathon Submission Points

✅ **Best Use of Opik**: Full pipeline tracing (triage → plan → critic + evals)  
✅ **Google DeepMind API**: Gemini 2.0 Flash as primary LLM  
✅ **Social Good**: Reduces caregiver burden via autonomous task execution  
✅ **Technical Innovation**: Conversational context gathering + auto-action approval  

## Architecture

```
User (WhatsApp) → Twilio Webhook
                     ↓
                 /api/whatsapp (conversational state machine)
                     ↓
                 Gemini 2.0 Flash (context understanding + plan generation)
                     ↓
                 Actions DB (pending → approved → executing → completed)
                     ↓
                 Vercel Cron (/api/actions/cron every 10min)
                     ↓
                 Twilio SMS (execute reminders)
                     ↓
                 Opik (trace everything)
```

## Important Notes

- **Twilio Sandbox**: Use for demo, upgrade to production number for real users
- **Cron Frequency**: 10min is demo-friendly, adjust for production
- **Opik API Key**: Rotate after hackathon
- **Database**: Neon free tier is fine for demo, scale after
