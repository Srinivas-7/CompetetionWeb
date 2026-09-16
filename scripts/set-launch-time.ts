#!/usr/bin/env node
/**
 * Admin Script: set-launch-time.ts
 * 
 * Updates the single source of truth (/config/launch) in Firestore using the Firebase Admin SDK.
 * Changes take effect dynamically without requiring code redeployment.
 * 
 * Usage:
 *   npx ts-node scripts/set-launch-time.ts "2026-09-15T19:40:00+05:30" "15 SEPTEMBER • 7:40 PM IST"
 *   npx ts-node scripts/set-launch-time.ts now
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log(`
Usage:
  npx ts-node scripts/set-launch-time.ts <ISO_DATE_OR_NOW> [DISPLAY_TIME_STRING]

Examples:
  npx ts-node scripts/set-launch-time.ts "2026-09-15T19:40:00+05:30" "15 SEPTEMBER • 7:40 PM IST"
  npx ts-node scripts/set-launch-time.ts now "LAUNCHED"
  `);
  process.exit(1);
}

const inputTime = args[0];
const displayTime = args[1] || (inputTime === 'now' ? 'LAUNCHED' : inputTime);

let targetDate: Date;
if (inputTime === 'now') {
  targetDate = new Date(Date.now() - 5000); // 5s in past to guarantee immediate unlock
} else {
  targetDate = new Date(inputTime);
}

if (isNaN(targetDate.getTime())) {
  console.error(`Error: Invalid date format "${inputTime}". Please pass an ISO string e.g. "2026-09-15T19:40:00+05:30" or "now".`);
  process.exit(1);
}

const epochMs = targetDate.getTime();
const isoString = targetDate.toISOString();

console.log('=== UPDATING FIRESTORE /config/launch ===');
console.log('Target Date:', targetDate.toString());
console.log('Epoch Milliseconds:', epochMs);
console.log('ISO String:', isoString);
console.log('Display Label:', displayTime);

const projectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || 'bappatrail-fef2d';
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

async function main() {
  try {
    if (getApps().length === 0) {
      if (clientEmail && privateKey) {
        initializeApp({
          credential: cert({ projectId, clientEmail, privateKey }),
        });
      } else {
        initializeApp({ projectId });
      }
    }

    const db = getFirestore();
    await db.doc('config/launch').set({
      launchTime: Timestamp.fromMillis(epochMs),
      launchTimeIso: inputTime === 'now' ? isoString : inputTime,
      displayTime,
      updatedAt: Timestamp.now(),
    }, { merge: true });

    console.log('✅ Successfully updated /config/launch in Firestore!');
    console.log('🎉 Launch gate updated! All clients and API will sync automatically.');
  } catch (err) {
    console.error('❌ Failed to update launch config:', err);
    process.exit(1);
  }
}

main();
