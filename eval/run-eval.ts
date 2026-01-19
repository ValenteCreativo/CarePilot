import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

// Import pipeline functions directly
import { generatePlan } from "../src/lib/pipeline";
import { flushOpik } from "../src/lib/opik";
import { db, llmRuns, llmEvals } from "../src/db";
import { eq, desc } from "drizzle-orm";
import type { LovedOneContext, CaregiverContext } from "../src/db/schema";

type Fixture = {
  name: string;
  lovedOneContext: LovedOneContext;
  caregiverContext: CaregiverContext;
};

type EvalResult = {
  fixture: string;
  actionability: number | null;
  feasibility: number | null;
  empathyTone: number | null;
  safetyPass: boolean;
  totalTime: number;
  error?: string;
};

async function loadFixtures(): Promise<Fixture[]> {
  const fixturesDir = join(__dirname, "fixtures");
  const files = readdirSync(fixturesDir).filter((f) => f.endsWith(".json"));

  return files.map((file) => {
    const content = readFileSync(join(fixturesDir, file), "utf-8");
    return JSON.parse(content) as Fixture;
  });
}

async function runEvalForFixture(fixture: Fixture): Promise<EvalResult> {
  const start = Date.now();

  // Use a synthetic case ID for eval runs
  const syntheticCaseId = `eval-${uuidv4()}`;

  try {
    console.log(`\nRunning: ${fixture.name}`);
    console.log(`  Situation: ${fixture.lovedOneContext.situationType}`);
    console.log(`  Time: ${fixture.caregiverContext.timePerWeek}h/week`);
    console.log(`  Budget: $${fixture.caregiverContext.budgetPerWeekUsd}/week`);

    // Note: This requires the case to exist in the DB
    // For eval purposes, we'll call the pipeline directly
    // In a real eval setup, you'd want to create temporary cases

    // For now, let's just run the pipeline without DB storage
    // and rely on Opik for tracing

    const result = await generatePlan(
      syntheticCaseId,
      fixture.lovedOneContext,
      fixture.caregiverContext
    );

    const totalTime = Date.now() - start;

    // Wait a bit for evals to complete
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Fetch the evals from the latest critic run
    const latestRun = await db.query.llmRuns.findFirst({
      where: eq(llmRuns.opikTraceId, result.traceId),
      orderBy: [desc(llmRuns.createdAt)],
      with: { evals: true },
    });

    const evals = latestRun?.evals || [];

    const actionability = evals.find((e) => e.metricName === "actionability")?.scoreNumber ?? null;
    const feasibility = evals.find((e) => e.metricName === "feasibility")?.scoreNumber ?? null;
    const empathyTone = evals.find((e) => e.metricName === "empathy_tone")?.scoreNumber ?? null;
    const safety = evals.find((e) => e.metricName === "safety");
    const safetyPass = safety?.verdict === "pass";

    console.log(`  Completed in ${totalTime}ms`);
    console.log(`  Actionability: ${actionability?.toFixed(1) ?? "N/A"}`);
    console.log(`  Feasibility: ${feasibility?.toFixed(1) ?? "N/A"}`);
    console.log(`  Empathy: ${empathyTone?.toFixed(1) ?? "N/A"}`);
    console.log(`  Safety: ${safetyPass ? "PASS" : "FAIL"}`);

    return {
      fixture: fixture.name,
      actionability,
      feasibility,
      empathyTone,
      safetyPass,
      totalTime,
    };
  } catch (error) {
    const totalTime = Date.now() - start;
    console.error(`  Error: ${error}`);

    return {
      fixture: fixture.name,
      actionability: null,
      feasibility: null,
      empathyTone: null,
      safetyPass: false,
      totalTime,
      error: String(error),
    };
  }
}

async function main() {
  console.log("=".repeat(60));
  console.log("CarePilot Evaluation Suite");
  console.log("=".repeat(60));

  // Check required env vars
  if (!process.env.OPENAI_API_KEY) {
    console.error("Error: OPENAI_API_KEY is required");
    process.exit(1);
  }

  if (!process.env.DATABASE_URL) {
    console.error("Error: DATABASE_URL is required");
    process.exit(1);
  }

  const fixtures = await loadFixtures();
  console.log(`\nLoaded ${fixtures.length} fixtures`);

  const results: EvalResult[] = [];

  for (const fixture of fixtures) {
    const result = await runEvalForFixture(fixture);
    results.push(result);

    // Small delay between fixtures
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // Flush all Opik traces
  await flushOpik();

  // Print summary
  console.log("\n" + "=".repeat(60));
  console.log("EVALUATION SUMMARY");
  console.log("=".repeat(60));

  const successful = results.filter((r) => !r.error);
  const failed = results.filter((r) => r.error);

  console.log(`\nTotal fixtures: ${results.length}`);
  console.log(`Successful: ${successful.length}`);
  console.log(`Failed: ${failed.length}`);

  if (successful.length > 0) {
    const avgActionability = successful
      .filter((r) => r.actionability !== null)
      .reduce((sum, r) => sum + (r.actionability as number), 0) / successful.length;

    const avgFeasibility = successful
      .filter((r) => r.feasibility !== null)
      .reduce((sum, r) => sum + (r.feasibility as number), 0) / successful.length;

    const avgEmpathy = successful
      .filter((r) => r.empathyTone !== null)
      .reduce((sum, r) => sum + (r.empathyTone as number), 0) / successful.length;

    const safetyPassRate = successful.filter((r) => r.safetyPass).length / successful.length;

    const avgTime = successful.reduce((sum, r) => sum + r.totalTime, 0) / successful.length;

    console.log("\nAggregate Metrics:");
    console.log(`  Avg Actionability: ${avgActionability.toFixed(2)}/5`);
    console.log(`  Avg Feasibility: ${avgFeasibility.toFixed(2)}/5`);
    console.log(`  Avg Empathy Tone: ${avgEmpathy.toFixed(2)}/5`);
    console.log(`  Safety Pass Rate: ${(safetyPassRate * 100).toFixed(1)}%`);
    console.log(`  Avg Time: ${(avgTime / 1000).toFixed(1)}s`);
  }

  if (failed.length > 0) {
    console.log("\nFailed fixtures:");
    failed.forEach((r) => {
      console.log(`  - ${r.fixture}: ${r.error}`);
    });
  }

  console.log("\n" + "=".repeat(60));
  console.log("Evaluation complete. Check Opik dashboard for detailed traces.");
  console.log("=".repeat(60));
}

main().catch(console.error);
