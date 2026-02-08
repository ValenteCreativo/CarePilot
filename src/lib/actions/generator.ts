import { db, actions, type PlanJson } from "@/db";
import type { Action } from "./types";

export interface GenerateActionsInput {
  caseId: string;
  plan: PlanJson;
  caregiverPhone?: string; // Optional for v1
}

export class ActionGenerator {
  async generateFromPlan(input: GenerateActionsInput): Promise<string[]> {
    const { caseId, plan, caregiverPhone } = input;
    const generatedIds: string[]= [];

    if (!caregiverPhone) {
      // No phone number yet, skip action generation
      return generatedIds;
    }

    // Generate daily check-in prompts (days 1-7)
    for (let day = 1; day <= 7; day++) {
      const scheduledFor = new Date();
      scheduledFor.setDate(scheduledFor.getDate() + day);
      scheduledFor.setHours(20, 0, 0, 0); // 8 PM default

      const [action] = await db
        .insert(actions)
        .values({
          caseId,
          type: "checkin_prompt",
          status: "pending", // Requires approval first time
          payload: {
            message: `Day ${day} check-in: ${plan.weekly_rhythm.checkin_prompt}`,
            phoneNumber: caregiverPhone,
            dayNumber: day,
          },
          scheduledFor,
        })
        .returning();

      generatedIds.push(action.id);
    }

    // Generate action reminders for high-priority actions
    const highPriorityActions = plan.actions.filter(
      (a) => a.effort === "high" || a.cost_usd > 100
    );

    for (const planAction of highPriorityActions.slice(0, 3)) {
      const scheduledFor = new Date();
      scheduledFor.setDate(scheduledFor.getDate() + 1);
      scheduledFor.setHours(9, 0, 0, 0); // 9 AM default

      const [action] = await db
        .insert(actions)
        .values({
          caseId,
          type: "reminder",
          status: "pending",
          payload: {
            message: `Reminder: ${planAction.title}. Steps: ${planAction.steps.join(", ")}`,
            phoneNumber: caregiverPhone,
            actionDay: 1,
            actionIndex: plan.actions.indexOf(planAction),
          },
          scheduledFor,
        })
        .returning();

      generatedIds.push(action.id);
    }

    return generatedIds;
  }
}

export const actionGenerator = new ActionGenerator();
