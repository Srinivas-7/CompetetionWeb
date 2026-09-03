import type { VercelRequest, VercelResponse } from '@vercel/node';
import { FieldValue } from 'firebase-admin/firestore';
import { adminAuth, adminDb, adminAppCheck } from './_lib/firebaseAdmin';
import { isValidPandhalId, NUM_SHARDS, EVENT_ID, getDeterministicShardIndex } from './_lib/constants';
import { checkRateLimit } from './_lib/rateLimiter';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. CORS & Preflight Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, X-Firebase-AppCheck'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'METHOD_NOT_ALLOWED',
      message: 'Only POST requests are supported.',
    });
  }

  // 2. Client IP & Rate Limiting Abuse Protection
  const forwarded = req.headers['x-forwarded-for'];
  const clientIp = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.socket?.remoteAddress || 'unknown';
  
  const rateLimit = checkRateLimit(clientIp, 15, 60000); // 15 requests/min per IP
  if (!rateLimit.allowed) {
    res.setHeader('Retry-After', String(rateLimit.retryAfterSec || 30));
    return res.status(429).json({
      success: false,
      error: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many voting requests. Please wait a few moments and try again.',
      retryAfter: rateLimit.retryAfterSec,
    });
  }

  // 3. Optional Firebase App Check Verification
  const appCheckToken = req.headers['x-firebase-appcheck'];
  if (typeof appCheckToken === 'string' && appCheckToken.trim().length > 0) {
    try {
      await adminAppCheck.verifyToken(appCheckToken);
    } catch (appCheckErr) {
      console.warn('[AppCheck Warning] Token verification failed:', appCheckErr);
      // Log for audit; do not block legitimate browser clients if AppCheck is optional
    }
  }

  // 4. Input Payload Extraction & Validation
  const { idToken, pandhalId, pandhalName, voterName } = req.body || {};

  if (!idToken || typeof idToken !== 'string' || idToken.trim().length === 0) {
    return res.status(401).json({
      success: false,
      error: 'MISSING_AUTH_TOKEN',
      message: 'Authentication token missing. Please sign in with Google.',
    });
  }

  if (!pandhalId || !isValidPandhalId(pandhalId)) {
    return res.status(400).json({
      success: false,
      error: 'INVALID_PANDHAL',
      message: 'Invalid or unrecognized Pandhal ID selected.',
    });
  }

  // 5. Cryptographic Firebase ID Token Verification via Admin SDK
  let decodedToken;
  try {
    decodedToken = await adminAuth.verifyIdToken(idToken);
  } catch (authError: any) {
    console.error('[Auth Error] verifyIdToken failed:', authError?.message || authError);
    return res.status(401).json({
      success: false,
      error: 'INVALID_OR_EXPIRED_TOKEN',
      message: 'Your Google sign-in session has expired. Please sign in again.',
    });
  }

  const { uid, email, name: tokenName } = decodedToken;
  const verifiedVoterName = tokenName || voterName || email?.split('@')[0] || 'Devotee';
  const voterDocId = `${EVENT_ID}_${uid}`;

  // 5b. Authenticated UID-based Abuse Rate Limiter
  const uidRateLimit = checkRateLimit(`uid:${uid}`, 6, 60000); // 6 attempts/min per user
  if (!uidRateLimit.allowed) {
    res.setHeader('Retry-After', String(uidRateLimit.retryAfterSec || 15));
    return res.status(429).json({
      success: false,
      error: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many rapid vote requests on this account. Please wait a few seconds.',
      retryAfter: uidRateLimit.retryAfterSec,
    });
  }

  // 5c. Configurable Daily Safety Budget Check (Optional, disabled by default in Blaze)
  const safetyBudget = process.env.DAILY_VOTE_BUDGET ? parseInt(process.env.DAILY_VOTE_BUDGET, 10) : 0;
  if (safetyBudget > 0 && process.env.BUDGET_PAUSED === 'true') {
    return res.status(503).json({
      success: false,
      error: 'SERVICE_TEMPORARILY_PAUSED',
      message: 'Voting is temporarily paused for scheduled daily maintenance. Please check back shortly.',
    });
  }

  // 6. Atomic Firestore Transaction (Uniqueness Guarantee & Sharded Counter Increment)
  try {
    const voterRef = adminDb.doc(`voters/${voterDocId}`);
    const shardIndex = getDeterministicShardIndex(uid, pandhalId);
    const shardRef = adminDb.doc(`counters/${pandhalId}/shards/shard_${shardIndex}`);

    const txResult = await adminDb.runTransaction(async (transaction) => {
      // Step A: Read voter record
      const voterSnap = await transaction.get(voterRef);

      if (voterSnap.exists) {
        const existingData = voterSnap.data();
        if (existingData?.pandhalId === pandhalId) {
          // Idempotent retry: Same voter, same target -> return safe success with 0 new writes
          return {
            status: 'IDEMPOTENT_SUCCESS',
            pandhalId,
            pandhalName: existingData.pandhalName || pandhalName || pandhalId,
          };
        }
        // Duplicate vote for a different pandhal
        return {
          status: 'ALREADY_VOTED',
          previousPandhalId: existingData?.pandhalId,
          previousPandhalName: existingData?.pandhalName,
        };
      }

      // Step B: Atomic Writes (Exactly 2 writes: 1 voter record + 1 distributed counter shard)
      transaction.set(voterRef, {
        uid,
        email: email || '',
        voterName: verifiedVoterName,
        pandhalId,
        pandhalName: pandhalName || pandhalId,
        eventId: EVENT_ID,
        votedAt: FieldValue.serverTimestamp(),
        ip: clientIp,
      });

      transaction.set(
        shardRef,
        {
          count: FieldValue.increment(1),
          lastUpdated: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      return {
        status: 'SUCCESS',
        pandhalId,
        pandhalName: pandhalName || pandhalId,
      };
    });

    if (txResult.status === 'ALREADY_VOTED') {
      return res.status(409).json({
        success: false,
        error: 'ALREADY_VOTED',
        message: `Your Google account has already cast its ballot for "${txResult.previousPandhalName || 'another Bappa'}". Each account is permitted exactly 1 vote.`,
        previousPandhalId: txResult.previousPandhalId,
        previousPandhalName: txResult.previousPandhalName,
      });
    }

    // Success (Fresh vote or idempotent safe retry)
    return res.status(200).json({
      success: true,
      message: `Your vote for ${txResult.pandhalName} is successfully locked!`,
      pandhalId: txResult.pandhalId,
      pandhalName: txResult.pandhalName,
      idempotent: txResult.status === 'IDEMPOTENT_SUCCESS',
    });
  } catch (dbError: any) {
    console.error('[Firestore Tx Error]', dbError);
    return res.status(500).json({
      success: false,
      error: dbError?.code || 'TRANSACTION_FAILED',
      message: dbError?.message || 'Failed to record vote due to high server traffic. Please retry in a moment.',
    });
  }
}
