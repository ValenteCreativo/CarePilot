# CarePilot

**A caregiver's command center.** Turn care into a plan.

CarePilot is a practical tool for caregivers managing complex care situations. It helps you create structured 7-day action plans tailored to your time, budget, and energy constraints.

## Features

- **Care Case Management**: Create and manage care cases for different situations (elder care, recovery, mental health, addiction, debt, legal, and more)
- **AI-Powered Planning**: Generate realistic 7-day plans using a 3-stage AI pipeline (triage → plan → critic)
- **Check-ins & Progress Tracking**: Log action completion, stress levels, and costs with visual charts
- **Quality Metrics**: View LLM evaluation scores for actionability, feasibility, empathy, and safety
- **Opik Integration**: Full tracing and evaluation logging for LLM observability
- **🆕 Autonomous Actions** (v2.0): AI agent executes actions (SMS/WhatsApp reminders) with approval workflow

## Demo Flow

1. **Create a Case**: Enter details about your care situation and your capacity as a caregiver
2. **Generate a Plan**: AI creates a tailored 7-day plan with 3 goals and concrete actions
3. **Track Progress**: Check in on actions, record stress levels, and monitor spending
4. **Review Quality**: View LLM quality metrics and Opik traces

## Tech Stack

- **Framework**: Next.js 16 (App Router) with TypeScript
- **UI**: TailwindCSS + shadcn/ui components
- **Database**: Neon Postgres with Drizzle ORM
- **AI**: OpenAI GPT-4o-mini with Opik tracing
- **Charts**: Recharts for progress visualization

## Opik Integration

CarePilot integrates with [Opik](https://www.comet.com/opik) for LLM observability:

### Tracing
- All OpenAI calls are automatically traced via `opik-openai`
- Each pipeline stage (triage, plan, critic) creates a separate trace
- Traces include input/output, latency, and metadata

### Evaluation Metrics
After generating a plan, the system runs LLM-as-judge evaluations:
- **Actionability** (1-5): Are steps concrete enough to act on today?
- **Feasibility** (1-5): Does the plan fit time/budget/energy constraints?
- **Empathy Tone** (1-5): Is the language warm and supportive?
- **Safety** (pass/fail): Does the plan avoid medical/legal advice?

### Quality Page
Visit `/case/[id]/quality` to see:
- Aggregate scores from recent evaluations
- Individual LLM run metrics with latency
- Links to Opik traces for detailed analysis

## Setup

### Prerequisites
- Node.js 18+
- Neon Postgres database
- OpenAI API key
- Opik API key (from [Comet](https://www.comet.com/opik))

### Environment Variables

Create a `.env.local` file (see `.env.example` for full reference):

```bash
# Database
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# OpenAI (legacy) or Gemini (hackathon sponsor)
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
# OR
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-pro

# Opik (LLM observability)
OPIK_API_KEY=your-opik-api-key
OPIK_PROJECT_NAME=carepilot
NEXT_PUBLIC_OPIK_PROJECT_URL=https://www.comet.com/opik/your-project

# Twilio (for autonomous SMS/WhatsApp actions + webhook bot)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-auth-token
# SMS sender
TWILIO_FROM_NUMBER=+1234567890
# WhatsApp sender (recommended; whatsapp:+E164)
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
# Backward-compatible alias
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

### Installation

```bash
# Install dependencies
npm install

# Push database schema to Neon
npm run db:push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Running Evaluations

The eval script runs the pipeline against 10 synthetic test cases:

```bash
npm run eval
```

This will:
- Load fixtures from `eval/fixtures/`
- Run the full pipeline (triage → plan → critic) for each
- Run LLM-as-judge evaluations
- Log traces to Opik
- Print aggregate metrics to console

### Simulate Twilio Webhook

Send a local test webhook to `/api/whatsapp`:

```bash
TWILIO_AUTH_TOKEN=your-auth-token \\
WEBHOOK_URL=http://localhost:3000/api/whatsapp \\
TWILIO_TEST_BODY=\"status\" \\
npm run whatsapp:simulate
```

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/case` | POST | Create a new care case |
| `/api/case/[id]` | GET | Get case details with plan and stats |
| `/api/case/[id]/generate-plan` | POST | Generate/update 7-day plan |
| `/api/case/[id]/checkin` | POST | Save a check-in entry |
| `/api/case/[id]/quality` | GET | Get LLM quality metrics |
| `/api/feedback` | POST | Submit plan helpfulness feedback |
| `/api/case/[id]/actions` | GET | List actions for a case |
| `/api/case/[id]/actions/generate` | POST | Generate autonomous actions from plan |
| `/api/actions/execute` | POST | Execute a specific action |
| `/api/actions/approve` | POST | Approve a pending action |
| `/api/whatsapp` | POST | Twilio WhatsApp webhook (bot) |

## Database Schema

- **users**: Anonymous users (cookie-based)
- **cases**: Care cases with context
- **plans**: Generated plans (JSON)
- **checkins**: Progress check-ins
- **llm_runs**: Pipeline execution logs
- **llm_evals**: Evaluation metrics
- **human_feedback**: User feedback on plans
- **actions** (v2.0): Autonomous actions (reminders, messages) with approval workflow

## Autonomous Actions (v2.0)

CarePilot v2.0 introduces **agent-driven execution**: instead of just suggesting actions, the AI can execute them with caregiver approval.

### How it works

1. **Generate Actions**: After creating a 7-day plan, visit `/case/[id]/actions` and click "Generate Actions"
2. **AI proposes actions**: System creates SMS/WhatsApp reminders for each planned action
3. **Approval Workflow**: Review pending actions and approve/reject them
4. **Execution**: Approved actions are sent via Twilio SMS or WhatsApp
5. **Tracking**: View execution history with Opik traces

### Action Types

- **reminder**: Scheduled SMS/WhatsApp reminder for a specific action
- **checkin_prompt**: Daily check-in reminder
- **message**: Custom message to caregiver

### Setup for Autonomous Actions

1. Configure Twilio credentials in `.env.local` (see Environment Variables section)
2. For WhatsApp: Join sandbox by texting your join code to `+1 415 523 8886`
3. Run `npm run db:push` to create the `actions` table
4. Generate a plan, then generate actions from it
5. Configure Twilio webhook URL to `https://your-deployment.vercel.app/api/whatsapp`

### Demo Flow (WhatsApp Bot)

**Vision**: Install CarePilot bot on WhatsApp → receive proactive reminders → check in via chat → AI adapts plan.

Current implementation:
- ✅ Action generation from plans
- ✅ Approval workflow UI
- ✅ SMS/WhatsApp execution via Twilio
- ✅ Opik tracing for all actions
- 🚧 Conversational check-ins (coming soon)
- 🚧 Adaptive scheduling based on engagement

## Deploying to Vercel

1. Push your code to GitHub
2. Import the repo in Vercel
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `OPENAI_API_KEY` or `GEMINI_API_KEY`
   - `OPENAI_MODEL` or `GEMINI_MODEL`
   - `OPIK_API_KEY`
   - `OPIK_PROJECT_NAME`
   - `TWILIO_ACCOUNT_SID` (for v2.0 autonomous actions)
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_FROM_NUMBER`
   - `TWILIO_WHATSAPP_NUMBER`
4. Deploy!

## Safety Note

**CarePilot is NOT a substitute for professional medical, legal, or therapeutic advice.**

The tool helps with organization and planning only:
- Medication reminder schedules (based on existing doctor instructions)
- Questions to ask professionals
- Logistics, budgeting, and coordination
- Appointment tracking

If you or someone you care for is in immediate danger, please contact emergency services.

## License

MIT
