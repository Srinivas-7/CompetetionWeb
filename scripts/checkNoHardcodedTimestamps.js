#!/usr/bin/env node
/**
 * CI / Build Anti-Regression Check
 * 
 * Verifies that NO hardcoded launch timestamp literals exist in application code,
 * ensuring Firestore /config/launch remains the STRICT SINGLE SOURCE OF TRUTH.
 */

import fs from 'fs';
import path from 'path';

const FORBIDDEN_PATTERNS = [
  /LAUNCH_TIMESTAMP\s*=\s*\d{12,14}/i,
  /timestamp\.value\(\s*17\d{11}\s*\)/i,
  /17894\d{8}/,
];

const SCAN_DIRS = ['src', 'api'];
const SCAN_FILES = ['firestore.rules'];
const EXCLUDED_FILES = [
  'setLaunchTime.js',
  'set-launch-time.ts',
  'checkNoHardcodedTimestamps.js',
  'testLaunchGateBypass.js',
  'verify-data-snapshot.js'
];

let violations = [];

function scanFile(filePath) {
  const basename = path.basename(filePath);
  if (EXCLUDED_FILES.includes(basename)) return;

  const content = fs.readFileSync(filePath, 'utf8');
  FORBIDDEN_PATTERNS.forEach((pattern) => {
    const match = content.match(pattern);
    if (match) {
      violations.push({
        file: filePath,
        matchedText: match[0],
        line: content.substring(0, match.index).split('\n').length
      });
    }
  });
}

function scanDir(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath);
    } else if (/\.(js|jsx|ts|tsx|rules)$/.test(entry.name)) {
      scanFile(fullPath);
    }
  }
}

SCAN_DIRS.forEach(scanDir);
SCAN_FILES.forEach((f) => {
  if (fs.existsSync(f)) scanFile(f);
});

console.log('=== CI SCAN: Hardcoded Launch Timestamp Regression Check ===');
if (violations.length > 0) {
  console.error('❌ FAIL: Found hardcoded launch timestamp literals in codebase:');
  violations.forEach((v) => {
    console.error(`  - ${v.file}:${v.line} -> "${v.matchedText}"`);
  });
  console.error('\nFix: All launch timestamps must be read dynamically from Firestore /config/launch.');
  process.exit(1);
} else {
  console.log('✅ PASS: Zero hardcoded launch timestamp literals found. Single Source of Truth (/config/launch) verified.');
  process.exit(0);
}
