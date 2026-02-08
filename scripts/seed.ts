import { db, users, cases, actions, type LovedOneContext, type CaregiverContext } from "@/db";
import { hashPassword } from "@/lib/password";

async function seed() {
  const email = "demo@carepilot.ai";
  const password = "carepilot-demo";

  const passwordHash = hashPassword(password);

  const [user] = await db
    .insert(users)
    .values({
      email,
      passwordHash,
      name: "Demo Caregiver",
      phoneNumber: "+15551234567",
    })
    .onConflictDoNothing()
    .returning();

  const userId = user?.id;
  if (!userId) {
    console.log("Seed user already exists. Skipping case/action seeding.");
    return;
  }

  const lovedOneContext: LovedOneContext = {
    situationType: "elder_care",
    summary: "Mom is recovering after a minor fall. Needs medication reminders and appointment coordination.",
    constraints: {
      mobility: true,
      medsChecklist: true,
      appointments: true,
    },
    riskSignals: {
      urgentMedical: false,
    },
  };

  const caregiverContext: CaregiverContext = {
    timePerWeek: 8,
    budgetPerWeekUsd: 120,
    distance: "same_city",
    energyLevel: 3,
    supportNetwork: "some_help",
    hardLimits: "No weekday mornings due to work.",
  };

  const [caseRow] = await db
    .insert(cases)
    .values({
      userId,
      title: "Recovery support for Mom",
      lovedOneContext,
      caregiverContext,
    })
    .returning();

  await db.insert(actions).values([
    {
      caseId: caseRow.id,
      type: "reminder",
      status: "pending",
      payload: { message: "Confirm afternoon medication schedule." },
      scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 2),
    },
    {
      caseId: caseRow.id,
      type: "calendar",
      status: "approved",
      payload: { message: "Book follow-up appointment with primary care." },
      scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
    },
    {
      caseId: caseRow.id,
      type: "message",
      status: "executing",
      payload: { message: "Check if new prescription was picked up." },
      scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 5),
    },
    {
      caseId: caseRow.id,
      type: "checkin_prompt",
      status: "completed",
      payload: { message: "Evening mood and pain check-in." },
      scheduledFor: new Date(Date.now() - 1000 * 60 * 60 * 3),
      executedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
      caseId: caseRow.id,
      type: "reminder",
      status: "failed",
      payload: { message: "Refill blood pressure prescription." },
      scheduledFor: new Date(Date.now() - 1000 * 60 * 60 * 24),
      failureReason: "Rejected by caregiver",
    },
  ]);

  console.log("Seeded demo user:", email, "password:", password);
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
