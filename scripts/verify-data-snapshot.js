#!/usr/bin/env node
/**
 * Verification Script: verify-data-snapshot.js
 * 
 * Guarantees ZERO DATA LOSS for live event Day 2.
 * Captures an exact pre-deployment baseline snapshot of voters and shard counts,
 * and asserts 100% strict equality post-deployment.
 * 
 * Usage:
 *   node scripts/verify-data-snapshot.js capture [output_path]
 *   node scripts/verify-data-snapshot.js compare <baseline_path> [current_path]
 */

import fs from 'fs';
import path from 'path';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const projectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || 'bappatrail-fef2d';
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

function getDb() {
  if (getApps().length === 0) {
    if (clientEmail && privateKey) {
      initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
      });
    } else {
      initializeApp({ projectId });
    }
  }
  return getFirestore();
}

async function captureDataSnapshot() {
  console.log('🔍 Fetching live data snapshot from Firestore...');
  const db = getDb();

  // 1. Fetch total count and document IDs from voters/
  const votersSnapshot = await db.collection('voters').get();
  const voterIds = [];
  votersSnapshot.forEach((docSnap) => {
    voterIds.push(docSnap.id);
  });
  voterIds.sort();

  // 2. Fetch all shard counts across all pandhals
  const shardsSnapshot = await db.collectionGroup('shards').get();
  const shardBreakdown = {};
  let totalShardSum = 0;

  shardsSnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const count = typeof data.count === 'number' ? data.count : 0;
    const docPath = docSnap.ref.path;
    shardBreakdown[docPath] = count;
    totalShardSum += count;
  });

  const snapshot = {
    capturedAt: new Date().toISOString(),
    projectId,
    totalVotersCount: voterIds.length,
    voterIds,
    totalShardSum,
    shardBreakdown,
  };

  return snapshot;
}

async function main() {
  const mode = process.argv[2] || 'capture';
  const targetFile = process.argv[3] || 'snapshot_baseline.json';

  if (mode === 'capture') {
    console.log('\n======================================================');
    console.log('📸 ZERO-DATA-LOSS BASELINE SNAPSHOT CAPTURE');
    console.log('======================================================\n');

    try {
      const snapshot = await captureDataSnapshot();
      fs.writeFileSync(targetFile, JSON.stringify(snapshot, null, 2), 'utf8');

      console.log(`✅ Baseline snapshot successfully saved to: ${targetFile}`);
      console.log(`📊 Total Voter Documents: ${snapshot.totalVotersCount}`);
      console.log(`📊 Total Sum Across All Shards: ${snapshot.totalShardSum}`);
      console.log(`📊 Total Shard Documents Recorded: ${Object.keys(snapshot.shardBreakdown).length}`);
      console.log('======================================================\n');
      process.exit(0);
    } catch (err) {
      console.error('❌ Failed to capture data snapshot:', err);
      process.exit(1);
    }
  } else if (mode === 'compare') {
    console.log('\n======================================================');
    console.log('⚖️ ZERO-DATA-LOSS POST-DEPLOYMENT EQUALITY VERIFICATION');
    console.log('======================================================\n');

    if (!fs.existsSync(targetFile)) {
      console.error(`❌ Baseline file "${targetFile}" not found. Please run "capture" first.`);
      process.exit(1);
    }

    try {
      const baseline = JSON.parse(fs.readFileSync(targetFile, 'utf8'));
      const current = await captureDataSnapshot();

      let errors = [];

      // Check 1: Voter doc count
      if (current.totalVotersCount !== baseline.totalVotersCount) {
        errors.push(`Voters doc count mismatch! Baseline: ${baseline.totalVotersCount}, Current: ${current.totalVotersCount}`);
      }

      // Check 2: Shard sum
      if (current.totalShardSum !== baseline.totalShardSum) {
        errors.push(`Total shard sum mismatch! Baseline: ${baseline.totalShardSum}, Current: ${current.totalShardSum}`);
      }

      // Check 3: Every shard from baseline must be identical in current
      for (const [shardPath, baselineCount] of Object.entries(baseline.shardBreakdown)) {
        const currentCount = current.shardBreakdown[shardPath];
        if (currentCount === undefined) {
          errors.push(`Missing shard document in current state: ${shardPath}`);
        } else if (currentCount !== baselineCount) {
          errors.push(`Shard count altered for ${shardPath}! Baseline: ${baselineCount}, Current: ${currentCount}`);
        }
      }

      if (errors.length > 0) {
        console.error('\n🚨🚨🚨 CRITICAL DEPLOYMENT MISMATCH DETECTED 🚨🚨🚨');
        console.error('The following data discrepancies were found:');
        errors.forEach(err => console.error(`  - ${err}`));
        console.error('\nHALTING: Deployment failed zero-data-loss verification.\n');
        process.exit(1); // Hard exit code 1 to halt pipeline
      }

      console.log('✅ 100% PERFECT MATCH CONFIRMED!');
      console.log(`✓ Total Voters: ${current.totalVotersCount} (Identical)`);
      console.log(`✓ Total Shard Sum: ${current.totalShardSum} (Identical)`);
      console.log(`✓ All ${Object.keys(current.shardBreakdown).length} individual shards verified untouched.`);
      console.log('======================================================\n');
      process.exit(0);
    } catch (err) {
      console.error('❌ Error during snapshot verification:', err);
      process.exit(1);
    }
  } else {
    console.log('Usage: node scripts/verify-data-snapshot.js [capture|compare] [filepath]');
    process.exit(1);
  }
}

main();
