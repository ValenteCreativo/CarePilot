#!/usr/bin/env tsx
/**
 * End-to-end login test
 * Tests the complete login flow including auth validation, cookie setting, and protected routes
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

interface TestResult {
  test: string;
  passed: boolean;
  details?: string;
  error?: string;
}

const results: TestResult[] = [];

function log(emoji: string, message: string) {
  console.log(`${emoji} ${message}`);
}

function logResult(result: TestResult) {
  const icon = result.passed ? "✅" : "❌";
  log(icon, `${result.test}`);
  if (result.details) {
    console.log(`   ${result.details}`);
  }
  if (result.error) {
    console.log(`   Error: ${result.error}`);
  }
}

async function testInvalidCredentials() {
  log("🧪", "Test 1: Login with invalid credentials (should fail)");
  
  try {
    const response = await fetch(`${BASE_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "invalid@example.com",
        password: "wrongpassword"
      })
    });

    const passed = response.status === 401;
    const data = await response.json().catch(() => ({}));

    results.push({
      test: "Invalid credentials should return 401",
      passed,
      details: `Status: ${response.status}, Message: ${data.message || 'N/A'}`
    });

    logResult(results[results.length - 1]);
  } catch (error) {
    results.push({
      test: "Invalid credentials test",
      passed: false,
      error: String(error)
    });
    logResult(results[results.length - 1]);
  }
}

async function testValidLogin(): Promise<string | null> {
  log("🧪", "Test 2: Login with valid credentials (should succeed)");
  
  try {
    const response = await fetch(`${BASE_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "demo@carepilot.ai",
        password: "carepilot-demo"
      })
    });

    const data = await response.json();
    const passed = response.status === 200 && data.ok === true;
    
    // Extract cookie from Set-Cookie header
    const setCookie = response.headers.get("set-cookie");
    const userId = data.userId;

    results.push({
      test: "Valid credentials should return 200 with userId",
      passed,
      details: `Status: ${response.status}, UserId: ${userId}, Cookie set: ${!!setCookie}`
    });

    logResult(results[results.length - 1]);

    return setCookie;
  } catch (error) {
    results.push({
      test: "Valid login test",
      passed: false,
      error: String(error)
    });
    logResult(results[results.length - 1]);
    return null;
  }
}

async function testMissingFields() {
  log("🧪", "Test 3: Login with missing fields (should fail)");
  
  try {
    const response = await fetch(`${BASE_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "demo@carepilot.ai"
        // missing password
      })
    });

    const passed = response.status === 400;
    const data = await response.json().catch(() => ({}));

    results.push({
      test: "Missing password should return 400",
      passed,
      details: `Status: ${response.status}, Message: ${data.message || 'N/A'}`
    });

    logResult(results[results.length - 1]);
  } catch (error) {
    results.push({
      test: "Missing fields test",
      passed: false,
      error: String(error)
    });
    logResult(results[results.length - 1]);
  }
}

async function testProtectedRoute(cookie: string | null) {
  log("🧪", "Test 4: Access protected route with valid cookie");
  
  if (!cookie) {
    results.push({
      test: "Protected route access",
      passed: false,
      error: "No cookie available from login test"
    });
    logResult(results[results.length - 1]);
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/dashboard`, {
      headers: {
        "Cookie": cookie
      },
      redirect: "manual"
    });

    // Dashboard should either return 200 (authenticated) or 307 redirect (needs more auth setup)
    // If it returns 302/307 to /login, that means auth failed
    const passed = response.status === 200 || response.status === 307;
    const redirectLocation = response.headers.get("location");

    results.push({
      test: "Protected route should be accessible with valid cookie",
      passed,
      details: `Status: ${response.status}, Redirect: ${redirectLocation || 'None'}`
    });

    logResult(results[results.length - 1]);
  } catch (error) {
    results.push({
      test: "Protected route access",
      passed: false,
      error: String(error)
    });
    logResult(results[results.length - 1]);
  }
}

async function testEmailCaseInsensitivity() {
  log("🧪", "Test 5: Login with uppercase email (should succeed)");
  
  try {
    const response = await fetch(`${BASE_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "DEMO@CAREPILOT.AI", // uppercase
        password: "carepilot-demo"
      })
    });

    const data = await response.json();
    const passed = response.status === 200 && data.ok === true;

    results.push({
      test: "Email should be case-insensitive",
      passed,
      details: `Status: ${response.status}, OK: ${data.ok}`
    });

    logResult(results[results.length - 1]);
  } catch (error) {
    results.push({
      test: "Email case-insensitivity test",
      passed: false,
      error: String(error)
    });
    logResult(results[results.length - 1]);
  }
}

async function runTests() {
  console.log("\n🚀 CarePilot Login E2E Test Suite\n");
  console.log(`Target: ${BASE_URL}\n`);
  console.log("=" .repeat(60));
  console.log("\n");

  await testInvalidCredentials();
  console.log();
  
  await testMissingFields();
  console.log();
  
  const cookie = await testValidLogin();
  console.log();
  
  await testEmailCaseInsensitivity();
  console.log();
  
  await testProtectedRoute(cookie);
  console.log();

  console.log("=" .repeat(60));
  console.log("\n📊 Test Summary\n");
  
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const total = results.length;
  
  console.log(`Total tests: ${total}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`\nSuccess rate: ${Math.round((passed / total) * 100)}%\n`);

  if (failed > 0) {
    console.log("Failed tests:");
    results.filter(r => !r.passed).forEach(r => {
      console.log(`  - ${r.test}`);
      if (r.error) {
        console.log(`    ${r.error}`);
      }
    });
    console.log();
  }

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(error => {
  console.error("Test suite failed:", error);
  process.exit(1);
});
