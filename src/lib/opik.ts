import { Opik } from "opik";
import OpenAI from "openai";
import { trackOpenAI } from "opik-openai";

// Singleton Opik client
let opikClient: Opik | null = null;

export function getOpikClient(): Opik {
  if (!opikClient) {
    opikClient = new Opik({
      projectName: process.env.OPIK_PROJECT_NAME || "carepilot",
    });
  }
  return opikClient;
}

// Singleton OpenAI client with Opik tracking
let trackedOpenAIClient: ReturnType<typeof trackOpenAI> | null = null;

export function getTrackedOpenAI() {
  if (!trackedOpenAIClient) {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    trackedOpenAIClient = trackOpenAI(openai, {
      client: getOpikClient(),
      traceMetadata: {
        tags: ["carepilot"],
      },
    });
  }
  return trackedOpenAIClient;
}

// Helper to get the model name
export function getModelName(): string {
  return process.env.OPENAI_MODEL || "gpt-4o-mini";
}

// Helper to create a trace for a pipeline run
export async function createPipelineTrace(
  caseId: string,
  stage: string,
  metadata?: Record<string, unknown>
) {
  const client = getOpikClient();
  const trace = client.trace({
    name: `${stage}-pipeline`,
    input: { caseId, stage },
    metadata: {
      caseId,
      stage,
      ...metadata,
    },
    tags: ["carepilot", stage],
  });
  return trace;
}

// Helper to log feedback scores for evals
export async function logEvalScores(
  traceId: string,
  scores: Array<{
    name: string;
    value: number;
    reason?: string;
  }>
) {
  const client = getOpikClient();
  await client.logTracesFeedbackScores(
    scores.map((score) => ({
      id: traceId,
      name: score.name,
      value: score.value,
      reason: score.reason,
    }))
  );
}

// Flush all pending traces
export async function flushOpik() {
  if (opikClient) {
    await opikClient.flush();
  }
  if (trackedOpenAIClient) {
    await trackedOpenAIClient.flush();
  }
}
