import { pgTable, uuid, text, timestamp, json, boolean, integer, real } from "drizzle-orm/pg-core";
import { relations, type InferSelectModel } from "drizzle-orm";

// Users table - anonymous users identified by cookie
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique(),
  passwordHash: text("password_hash"),
  name: text("name"),
  phoneNumber: text("phone_number").unique(),
  whatsappState: text("whatsapp_state").$type<"NUEVO" | "ACTIVO">(),
  whatsappStep: integer("whatsapp_step"),
  whatsappContext: json("whatsapp_context").$type<WhatsAppOnboardingContext>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// WhatsApp onboarding context JSON type
export type WhatsAppOnboardingContext = {
  caregivingSituation?: string;
  timeAvailable?: string;
  budgetConstraints?: string;
};

// Loved one context JSON type
export type LovedOneContext = {
  situationType: string; // Legacy single type for backward compatibility
  situationTypes?: ("recovery" | "elder_care" | "mental_health" | "addiction" | "debt" | "legal" | "other")[]; // Multi-select
  situationTypeOther?: string; // Custom text when "other" is selected
  summary: string;
  constraints: {
    mobility?: boolean;
    medsChecklist?: boolean;
    dietNeeded?: boolean;
    appointments?: boolean;
  };
  riskSignals: {
    selfHarm?: boolean;
    violence?: boolean;
    urgentMedical?: boolean;
    abuse?: boolean;
  };
};

// Caregiver context JSON type
export type CaregiverContext = {
  timePerWeek: number;
  budgetPerWeekUsd: number;
  distance: "same_home" | "same_city" | "remote";
  energyLevel: 1 | 2 | 3 | 4 | 5;
  supportNetwork: "alone" | "some_help" | "team";
  hardLimits: string;
};

// Cases table
export const cases = pgTable("cases", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  lovedOneContext: json("loved_one_context").$type<LovedOneContext>().notNull(),
  caregiverContext: json("caregiver_context").$type<CaregiverContext>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Plan JSON type
export type PlanJson = {
  case_summary: string;
  goals: Array<{
    id: string;
    title: string;
    why: string;
  }>;
  actions: Array<{
    id: string;
    goal_id: string;
    title: string;
    steps: string[];
    time_minutes: number;
    cost_usd: number;
    effort: "low" | "med" | "high";
    risk_notes: string;
    expected_signal: string;
  }>;
  weekly_rhythm: {
    checkin_prompt: string;
    review_prompt: string;
  };
  safety_notes: string[];
  change_log?: string[];
};

// Plans table
export const plans = pgTable("plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  caseId: uuid("case_id").notNull().references(() => cases.id),
  promptVersion: text("prompt_version").notNull(),
  model: text("model").notNull(),
  planJson: json("plan_json").$type<PlanJson>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Check-ins table
export const checkins = pgTable("checkins", {
  id: uuid("id").primaryKey().defaultRandom(),
  caseId: uuid("case_id").notNull().references(() => cases.id),
  date: timestamp("date").notNull(),
  actionId: text("action_id").notNull(),
  done: boolean("done").notNull(),
  outcomeNotes: text("outcome_notes"),
  costUsd: real("cost_usd"),
  stress: integer("stress").notNull(), // 1-5
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// LLM Runs table - tracks each stage of the pipeline
export const llmRuns = pgTable("llm_runs", {
  id: uuid("id").primaryKey().defaultRandom(),
  caseId: uuid("case_id").notNull().references(() => cases.id),
  stage: text("stage").notNull().$type<"triage" | "plan" | "critic">(),
  promptVersion: text("prompt_version").notNull(),
  model: text("model").notNull(),
  inputHash: text("input_hash").notNull(),
  outputJson: json("output_json").notNull(),
  latencyMs: integer("latency_ms").notNull(),
  opikTraceId: text("opik_trace_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// LLM Evals table - evaluation metrics for each run
export const llmEvals = pgTable("llm_evals", {
  id: uuid("id").primaryKey().defaultRandom(),
  llmRunId: uuid("llm_run_id").notNull().references(() => llmRuns.id),
  metricName: text("metric_name").notNull(), // actionability, feasibility, empathy_tone, safety
  scoreNumber: real("score_number"), // 1-5 for most, null for pass/fail
  verdict: text("verdict"), // pass/fail for safety
  rationale: text("rationale").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Human feedback table
export const humanFeedback = pgTable("human_feedback", {
  id: uuid("id").primaryKey().defaultRandom(),
  planId: uuid("plan_id").notNull().references(() => plans.id),
  helpful: boolean("helpful").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Actions table - autonomous actions to be executed
export const actions = pgTable("actions", {
  id: uuid("id").primaryKey().defaultRandom(),
  caseId: uuid("case_id").notNull().references(() => cases.id),
  type: text("type").notNull().$type<"reminder" | "message" | "calendar" | "checkin_prompt">(),
  status: text("status").notNull().$type<"pending" | "approved" | "executing" | "completed" | "failed">().default("pending"),
  payload: json("payload").notNull(),
  scheduledFor: timestamp("scheduled_for"),
  executedAt: timestamp("executed_at"),
  approvedAt: timestamp("approved_at"),
  failureReason: text("failure_reason"),
  opikTraceId: text("opik_trace_id"),
  externalId: text("external_id"), // Twilio SID, Calendar event ID, etc
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Messages table - WhatsApp conversation log (optional)
export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  direction: text("direction").notNull().$type<"inbound" | "outbound">(),
  body: text("body").notNull(),
  raw: json("raw"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Export Action type
export type Action = InferSelectModel<typeof actions>;

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  cases: many(cases),
  messages: many(messages),
}));

export const casesRelations = relations(cases, ({ one, many }) => ({
  user: one(users, {
    fields: [cases.userId],
    references: [users.id],
  }),
  plans: many(plans),
  checkins: many(checkins),
  llmRuns: many(llmRuns),
  actions: many(actions),
}));

export const plansRelations = relations(plans, ({ one, many }) => ({
  case: one(cases, {
    fields: [plans.caseId],
    references: [cases.id],
  }),
  feedback: many(humanFeedback),
}));

export const checkinsRelations = relations(checkins, ({ one }) => ({
  case: one(cases, {
    fields: [checkins.caseId],
    references: [cases.id],
  }),
}));

export const llmRunsRelations = relations(llmRuns, ({ one, many }) => ({
  case: one(cases, {
    fields: [llmRuns.caseId],
    references: [cases.id],
  }),
  evals: many(llmEvals),
}));

export const llmEvalsRelations = relations(llmEvals, ({ one }) => ({
  llmRun: one(llmRuns, {
    fields: [llmEvals.llmRunId],
    references: [llmRuns.id],
  }),
}));

export const humanFeedbackRelations = relations(humanFeedback, ({ one }) => ({
  plan: one(plans, {
    fields: [humanFeedback.planId],
    references: [plans.id],
  }),
}));

export const actionsRelations = relations(actions, ({ one }) => ({
  case: one(cases, {
    fields: [actions.caseId],
    references: [cases.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  user: one(users, {
    fields: [messages.userId],
    references: [users.id],
  }),
}));
