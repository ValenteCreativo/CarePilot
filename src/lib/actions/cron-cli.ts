import { executeApprovedActions } from "./cron";

async function main() {
  const result = await executeApprovedActions();
  console.log(`Executed ${result.processed} approved actions.`);
}

main().catch((error) => {
  console.error("Failed to execute approved actions:", error);
  process.exit(1);
});
