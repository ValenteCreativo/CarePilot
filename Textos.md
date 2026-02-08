# CarePilot Application Text Catalog (Textos.md)

This document catalogs all user-facing text strings across the CarePilot application to manage consistency, tone, and prepare for future localization.

---

## 1. Marketing Flow
**Source:** `src/app/(marketing)/page.tsx`

### Hero Section
- **Title:** `CarePilot: Caring is hard. Don't do it alone.`
- **Subtitle:** `CarePilot organizes the chaos of care through WhatsApp. Share your routine and your loved one's needs; we handle the reminders, appointments, and daily tasks so you can simply be present.`
- **Badge:** `Compassionate AI support for caregivers`
- **CTA:** `Start Your Free Trial`
- **Secondary CTA:** `Sign in`
- **Trust Badge 1:** `Privacy-first, caregiver-safe`
- **Trust Badge 2:** `Subscription: ~$30/mo after trial`

### Value Propositions
- **WhatsApp Support:** `24/7 WhatsApp support` / `Ask questions anytime and get calm, actionable guidance in minutes.`
- **Smart Scheduling:** `Smart scheduling` / `Coordinate appointments, follow-ups, and reminders without the back-and-forth.`
- **Medication:** `Medication management` / `Track meds, dosages, and refills with gentle nudges and check-ins.`
- **Coordination:** `Appointment coordination` / `Keep providers aligned with summaries, questions, and next steps.`

### How It Works (Nutria Style)
- **Section Title:** `How It Works`
- **Section Subtitle:** `Get started in minutes with a process designed to give you peace. No complex setups, everything happens where you already are: WhatsApp.`
- **Step 1:** `Tell Us Your Story` / `Share your loved one's context and your routine through WhatsApp. It's the beginning of our support network.`
- **Step 2:** `Your Guide Prepares the Plan` / `Your Otter Guide designs a 7-day plan tailored to your work and their specific needs.`
- **Step 3:** `You Decide, We Act` / `With one tap, you authorize tasks. We handle reminders, scheduling, and coordination.`
- **Step 4:** `Rest with Peace of Mind` / `24/7 WhatsApp assistance. You'll never care alone again; reclaim your time and peace.`
- **Lower CTA:** `Start Your Free Trial`
- **CTA Caption:** `Set up in 3 minutes • No credit card required`

### Our Plans
- **Head:** `A plan that respects your peace of mind`
- **Sub:** `For about $30/month, CarePilot handles the complexity of coordination so you can focus on what matters most: being present for your loved one.`
- **Badges:** `Free trial included`, `WhatsApp-native`, `Human-centered AI`
- **Card Pack:** `CarePilot Plus` / `$30/mo`
- **Rating:** `4.9` / `Caregiver rating`
- **Features:**
    - `Unlimited WhatsApp coordination`
    - `Medication tracking & proactive refills`
    - `Appointment organization assistance`
    - `Weekly insights & care summaries`
- **Footer:** `Cancel anytime. No hidden fees.`

### Trust Signals
- **Head:** `Built on trust`
- **Sub:** `We design CarePilot with privacy at the core. Your data is encrypted, access is limited, and you always maintain full control.`
- **Badges:** `Encrypted data`, `Consent-first`, `Audit-ready`
- **Proof Items:**
    - `Trusted by caregiving families across 20+ states`
    - `HIPAA-adjacent privacy practices and secure data handling`
    - `Built with clinicians and experienced caregivers`

### Final CTA Section
- **Heading:** `Ready to lighten the load?`
- **Description:** `Join thousands of families finding their peace with CarePilot. Meet your assistant on WhatsApp today.`
- **CTA:** `Start Your Free Trial`
- **Secondary CTA:** `Sign in`
- **Caption:** `Setup takes less than 3 minutes.`

---

## 2. Authentication Flow
**Sources:** `src/app/login/page.tsx`, `src/app/signup/page.tsx`, `src/components/auth/auth-form.tsx`

### Login Page
- **Navigation:** `← Back to home`
- **Heading:** `Keep caregiving aligned, one message at a time.`
- **Description:** `Sign in to review action queues, check WhatsApp activity, and keep care plans moving forward.`
- **Trust:** `HIPAA-adjacent security practices`

### Signup Page
- **Navigation:** `← Back to home`
- **Heading:** `Start your CarePilot trial in minutes.`
- **Description:** `Tell us how to reach you on WhatsApp. We'll set up your AI care assistant and start sending helpful reminders right away.`
- **Feature:** `WhatsApp-native, no new apps required`

### Auth Form Component (Shared)
- **Login Header:** `Welcome back`
- **Signup Header:** `Start your free trial`
- **Labels:** `Full name`, `WhatsApp number`, `Email`, `Password`
- **Placeholders:** `Jordan Lee`, `+1 555 123 4567`, `you@carepilot.com`, `••••••••`
- **Buttons:** `Sign in`, `Create account`
- **Toggle Links:** `Already have an account? Sign in`, `Need an account? Start free trial`
- **Toasts:** `Welcome back!`, `Welcome to CarePilot!`, `Request failed`, `Something went wrong`

---

## 3. Dashboard Interface
**Sources:** `src/app/dashboard/*`, `src/components/dashboard/*`

### Global Layout
- **Brand:** `CarePilot`
- **Sub:** `Caregiver AI workspace`
- **Navigation Items:** `Overview`, `Actions`, `WhatsApp Config`, `Analytics`, `Settings`
- **Sign Out:** `Sign out`

### Overview Page
- **Heading:** `Overview`
- **Description:** `Keep a pulse on today's care coordination and WhatsApp activity.`
- **Quick Buttons:** `New Case`, `Send Message`
- **Stats Labels:** `Active cases`, `Pending actions`, `Messages today`
- **Recent Activity:** `Recent activity` / `No recent messages yet.`
- **Activity Directions:** `Inbound`, `Outbound`
- **Quick Actions:**
    - `New case intake` / `Capture medical context, caregiver schedule, and priorities.` / `Start case`
    - `WhatsApp check-in` / `Send a quick update or test message to the caregiver.` / `Open WhatsApp config`

### Actions Page (Kanban)
- **Heading:** `Actions`
- **Description:** `Review and approve automation tasks before they run for caregivers.`
- **Columns:**
    - `Pending` (Awaiting caregiver approval)
    - `Approved` (Queued for execution)
    - `In Progress` (Actively executing)
    - `Completed` (Done or archived)
- **Card Elements:** `Care case`, `Care action`, `General action`, `Scheduled: [Date]`, `Scheduled time TBD`
- **Buttons:** `Approve`, `Reject`, `Mark complete`, `Executing...`, `Completed`, `Rejected`
- **Empty States:** `No actions here yet.`

### WhatsApp Config Page
- **Heading:** `WhatsApp configuration`
- **Description:** `Connect Twilio sandbox, personalize the bot, and test message delivery.`
- **Twilio Setup:**
    - `Connect WhatsApp (Twilio sandbox)`
    - `Open WhatsApp and send the message: join four-mission`
    - `Send to the Twilio sandbox number listed in your Twilio console.`
    - `Once connected, CarePilot will start logging messages here.`
    - `TWILIO_ACCOUNT_SID: [Masked]`
    - `Test webhook`
- **Personality:**
    - `Bot personality`
    - `Tone` (Warm and calm)
    - `Language` (English + Spanish)
    - `Response style` (Short, actionable steps)
- **Preferences:**
    - `Notification preferences`
    - `Quiet hours` (9pm - 7am)
    - `High priority alerts` (urgent medical issues, missed medications)
- **Toasts:** `Test message queued`, `Test failed`

### Analytics Page
- **Heading:** `Analytics`
- **Description:** `Track response quality, action throughput, and caregiver communication trends.`
- **Stats:** `Action completion rate`, `Avg response time`, `Data freshness`
- **Status:** `Refreshing...`, `Updated just now`
- **Chart:** `Message volume` (Last 7 days)
- **Chart Empty:** `No message data yet.`
- **Integrations:** `Opik dashboard` / `Add OPIK_DASHBOARD_URL to embed your live tracing dashboard here.`

### Settings Page
- **Heading:** `Settings`
- **Description:** `Update your profile, review subscription status, and manage account options.`
- **Profile:** `Profile`, `Name`, `Email`, `WhatsApp number`, `Not set`
- **Subscription:** `Subscription`, `Status`, `Trial`, `Plan`, `CarePilot Plus`, `Started`
- **Billing:** `Billing`, `Stripe billing management coming soon. We'll notify you before any charges start.`
- **Danger Zone:** `Danger zone`, `Delete your account and remove all CarePilot data permanently.`, `Delete account`
- **Toasts:** `Account deletion is a protected action. Please contact support.`

---

## 4. Footer & Common Meta
- **Footer Text:** `CarePilot · AI Care Assistant for caregivers`
- **Legal Disclaimer:** `Not a substitute for professional medical or legal advice.`
