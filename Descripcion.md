# CarePilot

**Tu Asistente de Cuidado con IA** — Cuidar de quienes amas, hecho más fácil.

CarePilot es un agente de IA basado en WhatsApp que ayuda a los cuidadores a gestionar situaciones de cuidado complejas. Dale contexto sobre ti, tu horario y las necesidades de tu ser querido — y te ayudará a ejecutar las tareas pequeñas pero críticas que mantienen el cuidado funcionando sin problemas.

## ¿Qué es CarePilot?

Un **servicio de suscripción** ($30/mes) que te da un asistente de IA en tu WhatsApp que:
- **Agenda citas** y envía recordatorios
- **Rastrea medicamentos** y te alerta cuando es hora
- **Paga facturas** y maneja logística
- **Responde preguntas** sobre tareas de cuidado
- **Se adapta a tu vida** basado en tu horario laboral, capacidad y necesidades del paciente

### ¿Por qué WhatsApp?

Porque los cuidadores están ocupados. No deberías necesitar otra aplicación — CarePilot te encuentra donde ya estás.

## Características

### 🤖 Bot de WhatsApp (Interfaz Principal)
- **Onboarding conversacional**: Cuéntale al bot sobre tu paciente y tu situación en lenguaje natural
- **Recordatorios inteligentes**: Horarios de medicamentos, preparación de citas, fechas de vencimiento de facturas
- **Sistema de comandos**:
  - `status` — Ve tus próximas 3 acciones aprobadas
  - `plan` — Ve tu plan de cuidado completo de 7 días
  - `update [mensaje]` — Ajusta contexto o planes
  - `help` — Obtén lista de comandos

### 📊 Panel Web
- **Descripción general**: Casos activos, acciones pendientes, actividad reciente
- **Kanban de Acciones**: Flujo de trabajo visual (Pendiente → Aprobado → En Progreso → Completado)
- **Configuración de WhatsApp**: Configuración del bot, ajustes de personalidad, preferencias de notificación
- **Análisis**: Volumen de mensajes, tasas de finalización de acciones, tiempos de respuesta (con Opik)
- **Configuración**: Perfil, estado de suscripción, facturación

### 🔄 Acciones Autónomas
- La IA propone acciones basadas en tu plan de cuidado
- Tú apruebas/rechazas vía panel web o WhatsApp
- Las acciones aprobadas se ejecutan automáticamente (recordatorios SMS/WhatsApp, agendamiento)
- Rastro completo de auditoría con trazas de Opik

### 🧠 Planificación Impulsada por IA
- **Gemini 2.0 Flash** como LLM principal (con OpenAI como respaldo)
- Consciente del contexto: Entiende tu horario laboral, condiciones del paciente, restricciones
- Genera planes de acción realistas de 7 días
- Aprende de tu feedback y se ajusta

### 📈 Calidad y Observabilidad
- **Integración con Opik** para trazado completo de LLM
- Métricas de evaluación: Capacidad de acción, Viabilidad, Empatía, Seguridad
- Monitoreo de tiempo de respuesta
- Seguimiento de finalización de acciones

## Stack Tecnológico

- **Frontend**: Next.js 15 (App Router), TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Rutas API de Next.js, Drizzle ORM
- **Base de Datos**: Neon Postgres
- **IA**: Google Gemini 2.0 Flash (principal), OpenAI GPT-4o-mini (respaldo)
- **Mensajería**: Twilio (SMS + WhatsApp)
- **Observabilidad**: Opik (trazado LLM + evaluaciones)
- **Autenticación**: Sesiones basadas en cookies (compatible con NextAuth)

## Estructura del Proyecto

```
CarePilot/
├── src/
│   ├── app/
│   │   ├── fonts/                 # Fuentes personalizadas (DMSans, Parisienne, Ultra)
│   │   ├── (marketing)/         # Página principal
│   │   ├── login/               # Páginas de autenticación
│   │   ├── signup/
│   │   ├── dashboard/           # Panel protegido
│   │   │   ├── page.tsx         # Descripción general
│   │   │   ├── actions/         # Tablero Kanban
│   │   │   ├── whatsapp/        # Configuración del bot
│   │   │   ├── analytics/       # Métricas de Opik
│   │   │   └── settings/        # Configuración de usuario
│   │   └── api/
│   │       ├── actions/         # CRUD + ejecución de acciones
│   │       ├── cases/           # Gestión de casos
│   │       ├── messages/        # Historial de mensajes
│   │       ├── analytics/       # Endpoint de estadísticas
│   │       ├── whatsapp/        # Webhook de Twilio
│   │       └── auth/            # Login/registro/cierre de sesión
│   ├── components/
│   │   ├── dashboard/           # Componentes del panel
│   │   ├── auth/                # Formularios de autenticación
│   │   └── ui/                  # Componentes shadcn/ui
│   ├── db/                      # Esquema Drizzle + cliente
│   ├── lib/
│   │   ├── actions/             # Generador + ejecutor de acciones
│   │   ├── ai/                  # Clientes LLM (Gemini, OpenAI)
│   │   ├── twilio.ts            # Integración con Twilio
│   │   └── password.ts          # Ayudantes de autenticación
├── scripts/
│   ├── seed.ts                  # Datos de demostración
│   └── simulate-whatsapp-webhook.ts  # Pruebas locales
├── drizzle/                     # Migraciones de BD
└── eval/                        # Suite de evaluación LLM
```

## Flujos de Usuario

### 1. Flujo del Panel Web
1. Visita la página principal en `/`
2. Haz clic en "Inicia Tu Prueba Gratuita" → `/signup`
3. Crea cuenta (email, contraseña, nombre, teléfono)
4. Redirigido a `/dashboard`
5. Configura el bot de WhatsApp en `/dashboard/whatsapp`
6. Crea un caso de cuidado (contexto del paciente)
7. Genera plan de 7 días
8. Revisa/aprueba acciones en `/dashboard/actions`
9. El bot ejecuta acciones aprobadas vía WhatsApp

### 2. Flujo del Bot de WhatsApp
1. Usuario envía mensaje a `+1 415 523 8886` con `join four-mission`
2. Bot: "¡Hola! Soy CarePilot. Cuéntame: ¿a quién cuidas y qué necesita?"
3. Usuario: "Mi papá, tuvo un derrame cerebral, necesita ayuda con medicinas y citas"
4. Bot: "Entiendo. ¿Cuánto tiempo puedes dedicarle por semana?"
5. Usuario: "2-3 horas diarias, trabajo full-time"
6. Bot genera plan y pide aprobación
7. Usuario: "sí"
8. Bot: "Listo. Mañana a las 9am te recordaré dar el medicamento."
9. Bot envía recordatorios proactivos en horarios programados

### 3. Comandos (WhatsApp)
- `status` → Próximas 3 acciones aprobadas
- `plan` → Resumen completo del plan de 7 días
- `update [mensaje]` → Ajustar contexto/plan
- `help` → Lista de comandos

## Seguridad y Privacidad

**CarePilot NO es un sustituto de consejo médico, legal o terapéutico profesional.**

Lo que CarePilot SÍ hace:
- ✅ Organiza horarios basado en instrucciones existentes de doctores
- ✅ Envía recordatorios para medicamentos, citas
- ✅ Rastrea logística, presupuesto, coordinación
- ✅ Sugiere preguntas para hacer a profesionales

Lo que CarePilot NO hace:
- ❌ Diagnostica condiciones
- ❌ Prescribe medicamentos
- ❌ Proporciona consejo legal o financiero
- ❌ Reemplaza cuidado profesional

**Privacidad**:
- Todos los datos cifrados en tránsito (TLS)
- Base de datos: Neon Postgres con SSL
- No se venden datos a terceros
- Historial de conversaciones almacenado de forma segura
- Usuario puede eliminar cuenta + datos cuando quiera

**Si tú o alguien a quien cuidas está en peligro inmediato, por favor contacta servicios de emergencia (911 en EE. UU.).**

---

Construido con ❤️ para cuidadores en todas partes. No estás solo.
