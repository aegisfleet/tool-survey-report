const process = require('process');

// 1. Simulate the GitHub Actions environment with potentially malicious input
process.env.TARGET_REPORT = "some_file.md\nINJECTED_LOG";
process.env.REPORT_COUNT = "invalid\r\nCOUNT";

console.log("--- Simulation Start ---");

// --- TARGET_REPORT HANDLING ---
console.log("\n[Test 1] TARGET_REPORT Handling:");
const targetReportInput = process.env.TARGET_REPORT;

// Vulnerable logging (would span multiple lines)
// console.log(`[VULNERABLE] Target report specified: "${targetReportInput}"`);

// Proposed Safe logging (sanitized)
if (targetReportInput && targetReportInput.trim() !== '') {
  const safeTargetInput = targetReportInput.replace(/[\r\n]+/g, ' ');
  console.log(`[SAFE] Target report specified: "${safeTargetInput}"`);

  if (safeTargetInput.includes('\n') || safeTargetInput.includes('\r')) {
    console.error("FAIL: Newlines detected in sanitized output!");
    process.exit(1);
  } else {
    console.log("PASS: Newlines successfully removed.");
  }
}

// --- REPORT_COUNT HANDLING ---
console.log("\n[Test 2] REPORT_COUNT Handling:");
let reportCount = parseInt(process.env.REPORT_COUNT, 10);

if (isNaN(reportCount) || reportCount < 1) {
  // Vulnerable logging
  // console.log(`[VULNERABLE] Invalid report_count "${process.env.REPORT_COUNT}", defaulting to 1`);

  // Proposed Safe logging (sanitized)
  const safeReportCountInput = process.env.REPORT_COUNT.replace(/[\r\n]+/g, ' ');
  console.log(`[SAFE] Invalid report_count "${safeReportCountInput}", defaulting to 1`);

  if (safeReportCountInput.includes('\n') || safeReportCountInput.includes('\r')) {
    console.error("FAIL: Newlines detected in sanitized output!");
    process.exit(1);
  } else {
    console.log("PASS: Newlines successfully removed.");
  }
  reportCount = 1;
}

console.log("\n--- Simulation End ---");
console.log("All tests passed.");
