# CarePilot

**Your AI Care Assistant** — Taking care of the ones you love, made easier.

CarePilot is a WhatsApp-based AI agent that helps caregivers manage complex care situations. Give it context about yourself, your schedule, and your loved one's needs — and it helps you execute the small but critical tasks that keep care running smoothly.

## What is CarePilot?

A **subscription service** ($30/mo) that gives you an AI assistant in your WhatsApp that:
- **Schedules appointments** and sends reminders
- **Tracks medications** and alerts you when it's time
- **Pays bills** and handles logistics
- **Answers questions** about care tasks
- **Adapts to your life** based on your work schedule, capacity, and patient needs

### Why WhatsApp?

Because caregivers are busy. You shouldn't need another app — CarePilot meets you where you already are.

## Features

### 🤖 WhatsApp Bot (Primary Interface)
- **Conversational onboarding**: Tell the bot about your patient and your situation in natural language
- **Smart reminders**: Medication times, appointment prep, bill due dates
- **Command system**:
  - `status` — See your next 3 approved actions
  - `plan` — View your full 7-day care plan
  - `update [message]` — Adjust context or plans
  - `help` — Get command list

### 📊 Web Dashboard
- **Overview**: Active cases, pending actions, recent activity
- **Actions Kanban**: Visual workflow (Pending → Approved → In Progress → Completed)
- **WhatsApp Config**: Bot setup, personality settings, notification preferences
- **Analytics**: Message volume, action completion rates, response times (powered by Opik)
- **Settings**: Profile, subscription status, billing

### 🔄 Autonomous Actions
- AI proposes actions based on your care plan
- You approve/reject via dashboard or WhatsApp
- Approved actions execute automatically (SMS/WhatsApp reminders, scheduling)
- Full audit trail with Opik tracing

### 🧠 AI-Powered Planning
- **Gemini 2.0 Flash** as primary LLM (with OpenAI fallback)
- Context-aware: Understands your work schedule, patient conditions, constraints
- Generates realistic 7-day action plans
- Learns from your feedback and adjusts

### 📈 Quality & Observability
- **Opik integration** for full LLM tracing
- Evaluation metrics: Actionability, Feasibility, Empathy, Safety
- Response time monitoring
- Action completion tracking

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Next.js API Routes, Drizzle ORM
- **Database**: Neon Postgres
- **AI**: Google Gemini 2.0 Flash (primary), OpenAI GPT-4o-mini (fallback)
- **Messaging**: Twilio (SMS + WhatsApp)
- **Observability**: Opik (LLM tracing + evals)
- **Auth**: Cookie-based sessions (NextAuth-ready)

## Project Structure

```
CarePilot/
├── src/
│   ├── app/
│   │   ├── (marketing)/         # Landing page
│   │   ├── login/               # Auth pages
│   │   ├── signup/
│   │   ├── dashboard/           # Protected dashboard
│   │   │   ├── page.tsx         # Overview
│   │   │   ├── actions/         # Kanban board
│   │   │   ├── whatsapp/        # Bot config
│   │   │   ├── analytics/       # Opik metrics
│   │   │   └── settings/        # User settings
│   │   └── api/
│   │       ├── actions/         # Action CRUD + execution
│   │       ├── cases/           # Case management
│   │       ├── messages/        # Message history
│   │       ├── analytics/       # Stats endpoint
│   │       ├── whatsapp/        # Twilio webhook
│   │       └── auth/            # Login/signup/logout
│   ├── components/
│   │   ├── dashboard/           # Dashboard components
│   │   ├── auth/                # Auth forms
│   │   └── ui/                  # shadcn/ui components
│   ├── db/                      # Drizzle schema + client
│   ├── lib/
│   │   ├── actions/             # Action generator + executor
│   │   ├── ai/                  # LLM clients (Gemini, OpenAI)
│   │   ├── twilio.ts            # Twilio integration
│   │   └── password.ts          # Auth helpers
├── scripts/
│   ├── seed.ts                  # Demo data seeding
│   └── simulate-whatsapp-webhook.ts  # Local testing
├── drizzle/                     # DB migrations
└── eval/                        # LLM eval suite
```

## Setup

### Prerequisites
- Node.js 18+
- Neon Postgres database
- Google Gemini API key
- Opik API key ([get one here](https://www.comet.com/opik))
- Twilio account (SMS + WhatsApp)

### Environment Variables

Create `.env.local` with:

```bash
# Database
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Google Gemini (primary LLM)
GOOGLE_AI_API_KEY=your_google_gemini_api_key

# Opik (LLM observability)
OPIK_API_KEY=your_opik_api_key
OPIK_PROJECT_NAME=carepilot
NEXT_PUBLIC_OPIK_PROJECT_URL=https://www.comet.com/opik/your-project

# Twilio (SMS + WhatsApp)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_FROM_NUMBER=+1234567890
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# Optional: OpenAI fallback
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

### Installation

```bash
# Install dependencies
npm install

# Push database schema
npm run db:push

# Seed demo data (optional)
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

### WhatsApp Setup

1. **Twilio Sandbox** (for testing):
   - Open WhatsApp
   - Send `join four-mission` to `+1 415 523 8886`
   - You're connected to the bot

2. **Configure Webhook**:
   - Go to Twilio Console → Messaging → Settings → WhatsApp Sandbox
   - Set webhook URL: `https://your-deployment.vercel.app/api/whatsapp`
   - Method: `POST`

3. **Test Locally**:
   ```bash
   npm run whatsapp:simulate
   ```

## User Flows

### 1. Web Dashboard Flow
1. Visit landing page at `/`
2. Click "Start Your Free Trial" → `/signup`
3. Create account (email, password, name, phone)
4. Redirected to `/dashboard`
5. Configure WhatsApp bot in `/dashboard/whatsapp`
6. Create a care case (patient context)
7. Generate 7-day plan
8. Review/approve actions in `/dashboard/actions`
9. Bot executes approved actions via WhatsApp

### 2. WhatsApp Bot Flow
1. User messages `+1 415 523 8886` with `join four-mission`
2. Bot: "Hola! Soy CarePilot. Cuéntame: ¿a quién cuidas y qué necesita?"
3. User: "Mi papá, tuvo un derrame cerebral, necesita ayuda con medicinas y citas"
4. Bot: "Entiendo. ¿Cuánto tiempo puedes dedicarle por semana?"
5. User: "2-3 horas diarias, trabajo full-time"
6. Bot generates plan and asks for approval
7. User: "sí"
8. Bot: "Listo. Mañana a las 9am te recordaré dar el medicamento."
9. Bot sends proactive reminders at scheduled times

### 3. Commands (WhatsApp)
- `status` → Next 3 approved actions
- `plan` → Full 7-day plan summary
- `update [mensaje]` → Adjust context/plan
- `help` → Command list

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/login` | POST | User login |
| `/api/signup` | POST | User registration |
| `/api/logout` | POST | User logout |
| `/api/cases` | GET, POST | List/create care cases |
| `/api/actions` | GET, POST | List/create actions |
| `/api/actions` | PATCH | Update action status |
| `/api/messages` | GET | Recent message history |
| `/api/analytics` | GET | Dashboard stats |
| `/api/whatsapp` | POST | Twilio webhook (bot) |
| `/api/whatsapp/test` | POST | Test webhook locally |

## Database Schema

- **users**: User accounts (email, password_hash, name, phone)
- **cases**: Care cases with loved one context
- **plans**: Generated 7-day plans (JSON)
- **actions**: Autonomous actions (pending/approved/completed)
- **messages**: WhatsApp conversation history
- **checkins**: Progress tracking
- **llm_runs**: LLM execution logs
- **llm_evals**: Quality metrics
- **human_feedback**: User feedback

## Development Scripts

```bash
# Start dev server
npm run dev

# Database
npm run db:push          # Push schema changes
npm run db:seed          # Seed demo data
npm run db:studio        # Drizzle Studio UI

# Testing
npm run whatsapp:simulate  # Simulate Twilio webhook
npm run eval              # Run LLM eval suite

# Build
npm run build
npm start                # Production server
```

## Deploying to Vercel

1. Push code to GitHub
2. Import repo in Vercel dashboard
3. Add environment variables:
   - `DATABASE_URL`
   - `GOOGLE_AI_API_KEY`
   - `OPIK_API_KEY`
   - `OPIK_PROJECT_NAME`
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_FROM_NUMBER`
   - `TWILIO_WHATSAPP_NUMBER`
   - (Optional) `OPENAI_API_KEY`, `NEXT_PUBLIC_OPIK_PROJECT_URL`
4. Deploy!
5. Configure Twilio webhook URL to your Vercel domain

### Production WhatsApp

To move from Twilio sandbox to production:
1. Request WhatsApp Business API access in Twilio Console
2. Register your business phone number
3. Update `TWILIO_WHATSAPP_NUMBER` to your approved number
4. Configure webhook URL as above

## Architecture

```
User (WhatsApp)
    ↓
Twilio Webhook → /api/whatsapp
    ↓
Parse message (From, Body, MessageSid)
    ↓
Check command (status/plan/help)
    OR
    ↓
Conversational AI (Gemini 2.0 Flash)
    ↓
Update context → Generate/adjust plan
    ↓
Create actions → Await approval
    ↓
User approves (web dashboard or WhatsApp)
    ↓
Vercel Cron (/api/actions/cron every 10min)
    ↓
Execute approved actions (Twilio SMS/WhatsApp)
    ↓
Log to Opik (full tracing)
```

## Safety & Privacy

**CarePilot is NOT a substitute for professional medical, legal, or therapeutic advice.**

What CarePilot does:
- ✅ Organize schedules based on existing doctor instructions
- ✅ Send reminders for medications, appointments
- ✅ Track logistics, budgeting, coordination
- ✅ Suggest questions to ask professionals

What CarePilot does NOT do:
- ❌ Diagnose conditions
- ❌ Prescribe medications
- ❌ Provide legal or financial advice
- ❌ Replace professional care

**Privacy**:
- All data encrypted in transit (TLS)
- Database: Neon Postgres with SSL
- No data sold to third parties
- Conversation history stored securely
- User can delete account + data anytime

**If you or someone you care for is in immediate danger, please contact emergency services (911 in US).**

## Roadmap

### v2.1 (Next)
- [ ] Stripe billing integration
- [ ] Multi-patient support (multiple cases per user)
- [ ] Voice messages (WhatsApp audio → transcription)
- [ ] Adaptive scheduling (learns from your engagement patterns)
- [ ] Calendar integration (Google/Apple)

### v3.0 (Future)
- [ ] Caregiver community (anonymous support groups)
- [ ] Professional network (connect with vetted services)
- [ ] Insurance claim tracking
- [ ] Multi-language support (español, português, français)
- [ ] iOS/Android native apps

## Contributing

Contributions welcome! Please open an issue first to discuss major changes.

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

---

Built with ❤️ for caregivers everywhere. You're not alone.
