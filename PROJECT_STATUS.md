# CarePilot - Project Status

> A caregiver's command center for structured care planning with AI-powered evaluation.

## Current Status: MVP Complete

**Last Updated:** January 2025

---

## What's Built

### Core Features

| Feature | Status | Notes |
|---------|--------|-------|
| Anonymous Auth | Done | Cookie-based user identification |
| Case Creation | Done | Multi-step form with situation types, constraints, risk signals |
| 7-Day Plan Generation | Done | AI-powered plan with goals, actions, time/cost estimates |
| Check-ins | Done | Track action completion, stress levels, outcome notes |
| Quality Metrics | Done | Opik-powered evaluation (actionability, feasibility, empathy, safety) |
| Progress Charts | Done | Visual stress tracking over time |

### Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Marketing landing page |
| `/app` | Dashboard with case cards and empty state |
| `/app/quality` | Quality metrics explanation page |
| `/case/new` | Multi-step case creation form |
| `/case/[id]` | Case detail with plan, check-ins, charts |
| `/case/[id]/quality` | Per-case quality evaluation history |

### Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** TailwindCSS v4 + shadcn/ui
- **Database:** PostgreSQL + Drizzle ORM
- **AI Integration:** OpenAI/Gemini for plan generation
- **Evaluation:** Opik for quality metrics

### Database Schema

- `users` - Anonymous users (cookie-based)
- `cases` - Care cases with loved one + caregiver context
- `plans` - Generated 7-day plans (JSON structure)
- `checkins` - Action completions with stress tracking
- `llm_runs` - Pipeline stage tracking (triage, plan, critic)
- `llm_evals` - Quality metrics per run
- `human_feedback` - User feedback on plans

---

## Recent Updates

### UI Polish (Jan 2025)
- Added premium marketing landing page at `/`
- Moved dashboard to `/app` route
- Enhanced empty state with welcome card and quick start
- Improved stepper visuals in case creation form
- Added icons for all situation types and constraints
- Multi-select for situation types (care can be multidimensional)
- "Other" text field for custom situation descriptions
- Collapsible "What these metrics mean" panel on quality pages
- Consistent typography and spacing across all pages

---

## Next Steps

### High Priority

1. **API Key Configuration**
   - Add settings page for OpenAI/Gemini API key input
   - Store encrypted in local storage or user preferences
   - Currently requires environment variable setup

2. **Plan Regeneration**
   - Allow users to regenerate plans with updated context
   - Show plan version history

3. **Mobile Optimization**
   - Test and refine mobile experience
   - Touch-friendly check-in interactions

### Medium Priority

4. **Export Functionality**
   - Export plans as PDF
   - Share plans via link

5. **Notifications/Reminders**
   - Daily check-in reminders
   - Weekly review prompts

6. **Plan Editing**
   - Edit generated actions
   - Add custom actions

### Low Priority / Future

7. **Multi-user Collaboration**
   - Share cases with other caregivers
   - Assign actions to team members

8. **Calendar Integration**
   - Sync actions to Google/Apple Calendar

9. **Resource Library**
   - Curated resources for different situation types
   - Emergency contacts directory

---

## Environment Setup

### Required Environment Variables

```env
# Database
DATABASE_URL=postgresql://...

# AI Provider (one of)
OPENAI_API_KEY=sk-...
GOOGLE_AI_API_KEY=...

# Opik (for evaluation)
OPIK_API_KEY=...
OPIK_PROJECT=carepilot
```

### Running Locally

```bash
# Install dependencies
npm install

# Run database migrations
npm run db:push

# Start development server
npm run dev
```

---

## File Structure

```
src/
├── app/
│   ├── (marketing)/      # Landing page
│   ├── app/              # Dashboard + quality explainer
│   ├── case/             # Case creation, detail, quality
│   └── api/              # API routes
├── components/
│   └── ui/               # shadcn components
├── db/
│   ├── index.ts          # Drizzle client
│   └── schema.ts         # Database schema + types
├── lib/
│   ├── ai.ts             # AI pipeline (triage, plan, critic)
│   ├── auth.ts           # Anonymous auth helpers
│   ├── opik.ts           # Opik evaluation integration
│   └── prompts/          # Prompt templates
```

---

## Quality Metrics Explained

CarePilot evaluates every generated plan using AI judges:

| Metric | Score Range | What It Measures |
|--------|-------------|------------------|
| Actionability | 1-5 | Are actions specific with clear next steps? |
| Feasibility | 1-5 | Can the plan be completed within constraints? |
| Empathy Tone | 1-5 | Is the language supportive and caring? |
| Safety | Pass/Fail | Are risks properly addressed? |

---

## Contributing

This is an open-source project. See the [GitHub repository](https://github.com/ValenteCreativo/CarePilot) for contribution guidelines.

---

## Disclaimer

CarePilot is a planning tool. Always consult healthcare professionals for medical decisions. If there's immediate danger, contact emergency services.
