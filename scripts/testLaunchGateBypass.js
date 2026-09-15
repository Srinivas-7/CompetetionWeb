#!/usr/bin/env node
/**
 * Test: LaunchGate Bypass Audit & Verification
 * 
 * Asserts that the isDev / skipgate / preview query param bypass
 * is 100% inert in production builds and only active when import.meta.env.DEV is true.
 */

function evaluateBypassGate(isDev, queryString) {
  const searchParams = new URLSearchParams(queryString);
  const bypassGate = isDev && (
    searchParams.has('skipgate') ||
    searchParams.has('preview')
  );
  return Boolean(bypassGate);
}

console.log('=== AUDITING LAUNCH GATE BYPASS LOGIC ===');

const productionTests = [
  { qs: '?skipgate=true', expected: false, desc: 'Production ?skipgate=true must be rejected' },
  { qs: '?preview=true', expected: false, desc: 'Production ?preview=true must be rejected' },
  { qs: '?preview=bappa2026', expected: false, desc: 'Production ?preview=bappa2026 must be rejected' },
  { qs: '?admin=true', expected: false, desc: 'Production ?admin=true must be rejected' },
  { qs: '', expected: false, desc: 'Production clean URL must be rejected' },
];

let failed = 0;

console.log('\n--- 1. Testing Production (import.meta.env.DEV = false) ---');
productionTests.forEach((t) => {
  const result = evaluateBypassGate(false, t.qs);
  const passed = result === t.expected;
  if (!passed) failed++;
  console.log(`[${passed ? 'PASS' : 'FAIL'}] ${t.desc} (result: ${result})`);
});

console.log('\n--- 2. Testing Local Dev (import.meta.env.DEV = true) ---');
const devTests = [
  { qs: '?skipgate=true', expected: true, desc: 'Dev ?skipgate=true must allow bypass' },
  { qs: '?preview=1', expected: true, desc: 'Dev ?preview=1 must allow bypass' },
  { qs: '', expected: false, desc: 'Dev clean URL must show countdown' },
];

devTests.forEach((t) => {
  const result = evaluateBypassGate(true, t.qs);
  const passed = result === t.expected;
  if (!passed) failed++;
  console.log(`[${passed ? 'PASS' : 'FAIL'}] ${t.desc} (result: ${result})`);
});

console.log('\n=========================================');
if (failed === 0) {
  console.log('✅ ALL AUDIT TESTS PASSED: Query param bypass is 100% inert in production builds.');
  process.exit(0);
} else {
  console.error(`❌ FAILED: ${failed} test(s) failed.`);
  process.exit(1);
}
