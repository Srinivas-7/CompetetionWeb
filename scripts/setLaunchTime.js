#!/usr/bin/env node
/**
 * Admin Script: setLaunchTime.js
 * 
 * Updates the single source of truth (/config/launch) in Firestore.
 * Changes take effect within seconds across all clients, API, and Firestore security rules
 * without requiring any code change or redeployment.
 * 
 * Usage:
 *   node scripts/setLaunchTime.js "2026-09-15T19:40:00+05:30" "15 SEPTEMBER • 7:40 PM IST"
 *   node scripts/setLaunchTime.js now
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import fs from 'fs';

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log(`
Usage:
  node scripts/setLaunchTime.js <ISO_DATE_OR_NOW> [DISPLAY_TIME_STRING]

Examples:
  node scripts/setLaunchTime.js "2026-09-15T19:40:00+05:30" "15 SEPTEMBER • 7:40 PM IST"
  node scripts/setLaunchTime.js now "LAUNCHED"
  `);
  process.exit(1);
}

const inputTime = args[0];
const displayTime = args[1] || (inputTime === 'now' ? 'LAUNCHED' : inputTime);

let targetDate;
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

async function updateViaAdmin() {
  if (clientEmail && privateKey) {
    if (getApps().length === 0) {
      initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
      });
    }
    const db = getFirestore();
    await db.doc('config/launch').set({
      launchTime: Timestamp.fromMillis(epochMs),
      launchTimeIso: inputTime === 'now' ? isoString : inputTime,
      displayTime,
      updatedAt: Timestamp.now(),
    }, { merge: true });
    console.log('✅ Successfully updated /config/launch via Firebase Admin SDK!');
    return true;
  }
  return false;
}

async function updateViaRest() {
  console.log('Admin credentials not found in env, writing via Firestore REST endpoint...');
  const restUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/config/launch`;
  const res = await fetch(restUrl, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fields: {
        launchTime: { timestampValue: isoString },
        launchTimeIso: { stringValue: inputTime === 'now' ? isoString : inputTime },
        displayTime: { stringValue: displayTime },
        updatedAt: { timestampValue: new Date().toISOString() }
      }
    })
  });

  if (res.ok) {
    console.log('✅ Successfully updated /config/launch via Firestore REST API!');
  } else {
    const errText = await res.text();
    console.error('REST API write response:', res.status, errText);
  }
}

async function main() {
  try {
    const adminDone = await updateViaAdmin();
    if (!adminDone) {
      await updateViaRest();
    }
    console.log('\n🎉 Launch gate updated! All clients, API, and Firestore Rules will sync automatically.');
  } catch (err) {
    console.error('Failed to update launch config:', err);
    process.exit(1);
  }
}

main();
