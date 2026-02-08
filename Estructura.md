# Estructura del Proyecto - CarePilot

Esta es la estructura actual de archivos y carpetas del proyecto.

```text
.
├── PROJECT_STATUS.md
├── DEPLOYMENT.md
├── README.md
├── next.config.ts
├── tsconfig.json
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── eslint.config.mjs
├── components.json
├── vercel.json
├── drizzle.config.ts
├── .env.example
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── scripts/
│   ├── seed.ts
│   └── simulate-whatsapp-webhook.ts
├── eval/
│   ├── run-eval.ts
│   └── fixtures/
│       ├── 01-elder-care-basic.json
│       ├── 02-recovery-post-surgery.json
│       ├── 03-mental-health-support.json
│       ├── 04-addiction-recovery.json
│       ├── 05-debt-crisis.json
│       ├── 06-legal-issues.json
│       ├── 07-elder-dementia.json
│       ├── 08-high-risk-mental-health.json
│       ├── 09-urgent-medical.json
│       └── 10-low-resource.json
├── drizzle/
│   ├── 0000_blue_randall_flagg.sql
│   ├── 0001_whatsapp_support.sql
│   └── meta/
│       ├── 0000_snapshot.json
│       └── _journal.json
└── src/
    ├── app/
    │   ├── favicon.ico
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── loading.tsx
    │   ├── page.tsx (Marketing/Home)
    │   ├── login/
    │   │   └── page.tsx
    │   ├── signup/
    │   │   └── page.tsx
    │   ├── (marketing)/
    │   │   ├── layout.tsx
    │   │   └── page.tsx
    │   ├── dashboard/
    │   │   ├── layout.tsx
    │   │   ├── page.tsx
    │   │   ├── actions/
    │   │   │   └── page.tsx
    │   │   ├── analytics/
    │   │   │   └── page.tsx
    │   │   ├── settings/
    │   │   │   └── page.tsx
    │   │   └── whatsapp/
    │   │       └── page.tsx
    │   ├── app/ (Sub-app logic)
    │   │   ├── layout.tsx
    │   │   ├── page.tsx
    │   │   └── quality/
    │   │       └── page.tsx
    │   ├── case/
    │   │   ├── layout.tsx
    │   │   ├── new/
    │   │   │   └── page.tsx
    │   │   └── [id]/
    │   │       ├── page.tsx
    │   │       ├── actions/
    │   │       │   └── page.tsx
    │   │       └── quality/
    │   │           └── page.tsx
    │   └── api/
    │       ├── actions/
    │       │   ├── route.ts
    │       │   ├── approve/
    │       │   │   └── route.ts
    │       │   ├── cron/
    │       │   │   └── route.ts
    │       │   ├── execute/
    │       │   │   └── route.ts
    │       │   └── reject/
    │       │       └── route.ts
    │       ├── analytics/
    │       │   └── route.ts
    │       ├── case/
    │       │   ├── route.ts
    │       │   └── [id]/
    │       │       ├── route.ts
    │       │       ├── actions/
    │       │       │   └── route.ts
    │       │       ├── checkin/
    │       │       │   └── route.ts
    │       │       ├── generate-plan/
    │       │       │   └── route.ts
    │       │       └── quality/
    │       │           └── route.ts
    │       ├── cases/
    │       │   └── route.ts
    │       ├── feedback/
    │       │   └── route.ts
    │       ├── login/
    │       │   └── route.ts
    │       ├── logout/
    │       │   └── route.ts
    │       ├── messages/
    │       │   └── route.ts
    │       ├── signup/
    │       │   └── route.ts
    │       └── whatsapp/
    │           ├── route.ts
    │           └── test/
    │               └── route.ts
    ├── components/
    │   ├── auth/
    │   │   ├── auth-form.tsx
    │   │   └── signout-button.tsx
    │   ├── dashboard/
    │   │   ├── actions-kanban.tsx
    │   │   ├── analytics-dashboard.tsx
    │   │   ├── settings-client.tsx
    │   │   └── whatsapp-config.tsx
    │   └── ui/ (Shadcn UI components)
    │       ├── alert.tsx
    │       ├── badge.tsx
    │       ├── button.tsx
    │       ├── card.tsx
    │       ├── checkbox.tsx
    │       ├── collapsible.tsx
    │       ├── dialog.tsx
    │       ├── form.tsx
    │       ├── input.tsx
    │       ├── label.tsx
    │       ├── radio-group.tsx
    │       ├── select.tsx
    │       ├── separator.tsx
    │       ├── skeleton.tsx
    │       ├── slider.tsx
    │       ├── sonner.tsx
    │       ├── table.tsx
    │       ├── tabs.tsx
    │       └── textarea.tsx
    ├── db/
    │   ├── index.ts
    │   └── schema.ts
    └── lib/
        ├── auth.ts
        ├── gemini.ts
        ├── opik.ts
        ├── password.ts
        ├── twilio.ts
        ├── utils.ts
        ├── actions/
        │   ├── cron-cli.ts
        │   ├── cron.ts
        │   ├── executor.ts
        │   ├── generator.ts
        │   ├── twilio.ts
        │   └── types.ts
        └── pipeline/
            ├── index.ts
            └── prompts.ts
```

## Resumen de carpetas principales

- **`src/app`**: Rutas de Next.js (App Router), incluye páginas y layouts.
- **`src/api`**: Endpoints de la API del proyecto.
- **`src/components`**: Componentes de React, divididos en lógica de negocio y UI general (Shadcn).
- **`src/lib`**: Utilidades, configuración de servicios externos (Twilio, Gemini, Auth) y lógica central.
- **`src/db`**: Configuración de la base de datos y esquemas de Drizzle ORM.
- **`drizzle`**: Migraciones de la base de datos SQL.
- **`eval`**: Pruebas de evaluación y fixtures para el sistema.
- **`scripts`**: Scripts de utilidad para desarrollo y seeding.
- **`public`**: Activos estáticos como imágenes y vectores.
