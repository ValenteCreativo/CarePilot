import { db, actions, type Action } from "@/db";
import { eq } from "drizzle-orm";
import { twilioService } from "./twilio";
import { getOpikClient } from "../opik";
import type { ActionExecutionResult } from "./types";

export class ActionExecutor {
  async executeAction(actionId: string): Promise<ActionExecutionResult> {
    const opikClient = getOpikClient();

    // Fetch action
    const [action] = await db
      .select()
      .from(actions)
      .where(eq(actions.id, actionId))
      .limit(1);

    if (!action) {
      return {
        success: false,
        executedAt: new Date(),
        error: "Action not found",
      };
    }

    // Create Opik trace for execution
    const trace = opikClient.trace({
      name: "action-execution",
      input: {
        actionId: action.id,
        type: action.type,
        caseId: action.caseId,
      },
      metadata: {
        actionType: action.type,
        status: action.status,
      },
      tags: ["carepilot", "action", action.type],
    });

    try {
      // Update status to executing
      await db
        .update(actions)
        .set({
          status: "executing",
          opikTraceId: trace.data.id,
          updatedAt: new Date(),
        })
        .where(eq(actions.id, actionId));

      let result: ActionExecutionResult;

      // Execute based on type
      switch (action.type) {
        case "reminder":
        case "message":
        case "checkin_prompt":
          result = await this.executeSmsAction(action);
          break;
        default:
          result = {
            success: false,
            executedAt: new Date(),
            error: `Unknown action type: ${action.type}`,
          };
      }

      // Update action with result
      await db
        .update(actions)
        .set({
          status: result.success ? "completed" : "failed",
          executedAt: result.executedAt,
          failureReason: result.error,
          externalId: result.externalId,
          updatedAt: new Date(),
        })
        .where(eq(actions.id, actionId));

      trace.update({
        output: result,
      });
      trace.end();

      return result;
    } catch (error) {
      const failureResult: ActionExecutionResult = {
        success: false,
        executedAt: new Date(),
        error: String(error),
      };

      await db
        .update(actions)
        .set({
          status: "failed",
          executedAt: failureResult.executedAt,
          failureReason: failureResult.error,
          updatedAt: new Date(),
        })
        .where(eq(actions.id, actionId));

      trace.update({
        output: failureResult,
      });
      trace.end();

      return failureResult;
    }
  }

  private async executeSmsAction(
    action: Action & { type: "reminder" | "message" | "checkin_prompt" }
  ): Promise<ActionExecutionResult> {
    const payload = action.payload as {
      message: string;
      phoneNumber: string;
    };

    const result = await twilioService.sendSms(
      payload.phoneNumber,
      payload.message
    );

    if (result.success) {
      return {
        success: true,
        executedAt: new Date(),
        message: "SMS sent successfully",
        externalId: result.sid,
      };
    } else {
      return {
        success: false,
        executedAt: new Date(),
        error: result.error || "Failed to send SMS",
      };
    }
  }

  async approveAction(actionId: string): Promise<boolean> {
    try {
      await db
        .update(actions)
        .set({
          status: "approved",
          approvedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(actions.id, actionId));

      return true;
    } catch {
      return false;
    }
  }

  async getPendingActions(caseId: string): Promise<Action[]> {
    return db
      .select()
      .from(actions)
      .where(eq(actions.caseId, caseId)) as Promise<Action[]>;
  }
}

export const actionExecutor = new ActionExecutor();
