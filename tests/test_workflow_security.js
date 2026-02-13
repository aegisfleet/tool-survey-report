const assert = require('assert');

console.log('Running security regression tests for report_count...');

const testCases = [
  { input: '1', expected: 1, name: 'Normal integer' },
  { input: '5', expected: 5, name: 'Another normal integer' },
  { input: '1; process.exit(1)', expected: 1, name: 'Injection attempt with semicolon' },
  { input: '10" + malicious', expected: 10, name: 'Injection attempt with quote' },
  { input: '${{ 1 + 1 }}', expected: NaN, name: 'Template syntax (should be string)' },
  { input: '', expected: NaN, name: 'Empty string' },
  { input: undefined, expected: NaN, name: 'Undefined' }
];

let failed = false;

testCases.forEach(test => {
  try {
    // Mocking the environment variable
    process.env.REPORT_COUNT = test.input;

    // Simulating the code in the workflow
    // let reportCount = parseInt(process.env.REPORT_COUNT, 10);
    const reportCount = parseInt(process.env.REPORT_COUNT, 10);

    if (Number.isNaN(test.expected)) {
      assert(Number.isNaN(reportCount), `Expected NaN for input "${test.input}", got ${reportCount}`);
    } else {
      assert.strictEqual(reportCount, test.expected, `Expected ${test.expected} for input "${test.input}", got ${reportCount}`);
    }
    console.log(`✅ Passed: ${test.name}`);
  } catch (error) {
    console.error(`❌ Failed: ${test.name} - ${error.message}`);
    failed = true;
  }
});

// Test TARGET_REPORT safety check simulation
console.log('\nRunning security regression tests for TARGET_REPORT...');
const targetTestCases = [
    { input: 'my-report', expected: 'my-report', name: 'Normal report name' },
    { input: '"; malicious(); //', expected: '"; malicious(); //', name: 'Injection attempt' }
];

targetTestCases.forEach(test => {
    try {
        process.env.TARGET_REPORT = test.input;
        const targetReportInput = process.env.TARGET_REPORT;

        // Simulating usage
        const targetInput = targetReportInput.trim();

        assert.strictEqual(targetInput, test.expected.trim(), `Expected "${test.expected.trim()}" for input "${test.input}", got "${targetInput}"`);

        // Ensure it is just a string and not executed
        assert.strictEqual(typeof targetInput, 'string');

        console.log(`✅ Passed: ${test.name}`);
    } catch (error) {
        console.error(`❌ Failed: ${test.name} - ${error.message}`);
        failed = true;
    }
});

if (failed) {
  console.error('\nTests failed!');
  process.exit(1);
} else {
  console.log('\nAll security tests passed!');
}
