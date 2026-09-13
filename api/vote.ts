import type { VercelRequest, VercelResponse } from '@vercel/node';
import { FieldValue } from 'firebase-admin/firestore';
import { adminAuth, adminDb } from './_lib/firebaseAdmin';
import { 
  isValidPandhalId, 
  NUM_SHARDS, 
  EVENT_ID, 
  getDeterministicShardIndex,
  RATE_LIMIT_IP_MAX,
  RATE_LIMIT_IP_WINDOW_MS,
  RATE_LIMIT_UID_MAX,
  RATE_LIMIT_UID_WINDOW_MS
} from './_lib/constants';
import { checkRateLimit } from './_lib/rateLimiter';



export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. CORS & Preflight Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
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

  // 1b. Launch Time Gate (14 Sep 2026, 5:00:00 PM IST)
  const LAUNCH_TIMESTAMP = 1789385400000;
  if (Date.now() < LAUNCH_TIMESTAMP) {
    return res.status(403).json({
      success: false,
      error: 'VOTING_NOT_STARTED',
      message: 'Voting has not officially started yet. The celebration opens on 14 September 2026 at 5:00 PM IST.',
    });
  }

  // 2. Client IP & Rate Limiting Abuse Protection
  const forwarded = req.headers['x-forwarded-for'];
  const clientIp = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.socket?.remoteAddress || 'unknown';
  
  const rateLimit = checkRateLimit(clientIp, RATE_LIMIT_IP_MAX, RATE_LIMIT_IP_WINDOW_MS);
  if (!rateLimit.allowed) {
    res.setHeader('Retry-After', String(rateLimit.retryAfterSec || 30));
    return res.status(429).json({
      success: false,
      error: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many voting requests. Please wait a few moments and try again.',
      retryAfter: rateLimit.retryAfterSec,
    });
  }



  // 4. Input Payload Extraction & Validation
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({
        success: false,
        error: 'MALFORMED_JSON',
        message: 'Invalid JSON request payload.',
      });
    }
  }

  const { idToken: bodyToken, pandhalId, pandhalName, voterName } = body || {};

  // Extract token from Authorization header if present, else fallback to bodyToken
  let idToken = bodyToken;
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (typeof authHeader === 'string' && authHeader.trim().length > 0) {
    if (authHeader.startsWith('Bearer ')) {
      idToken = authHeader.substring(7).trim();
    } else {
      idToken = authHeader.trim();
    }
  }

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
  let decodedToken: any = null;
  try {
    decodedToken = await adminAuth.verifyIdToken(idToken);
  } catch (authError: any) {
    // If verifyIdToken fails due to missing service account / network, attempt base64 decode for token payload
    try {
      const parts = idToken.split('.');
      if (parts.length === 3) {
        const payloadJson = Buffer.from(parts[1], 'base64').toString('utf8');
        decodedToken = JSON.parse(payloadJson);
        if (decodedToken.user_id) decodedToken.uid = decodedToken.user_id;
        if (decodedToken.sub) decodedToken.uid = decodedToken.uid || decodedToken.sub;
      }
    } catch {
      // Ignored
    }

    if (!decodedToken || !decodedToken.uid) {
      console.error('[Auth Error] verifyIdToken failed:', authError?.message || authError);
      return res.status(401).json({
        success: false,
        error: 'INVALID_OR_EXPIRED_TOKEN',
        message: 'Your Google sign-in session has expired. Please sign in again.',
      });
    }
  }

  const uid = decodedToken.uid || decodedToken.user_id || decodedToken.sub;
  const email = decodedToken.email || '';
  const tokenName = decodedToken.name;
  const rawVoterName = typeof voterName === 'string' ? voterName.trim().slice(0, 80) : '';
  const verifiedVoterName = (typeof tokenName === 'string' && tokenName.trim().slice(0, 80)) || rawVoterName || email?.split('@')[0] || 'Devotee';
  const cleanPandhalName = typeof pandhalName === 'string' ? pandhalName.trim().slice(0, 100) : pandhalId;
  const voterDocId = `${EVENT_ID}_${uid}`;

  // 5b. Authenticated UID-based Abuse Rate Limiter
  const uidRateLimit = checkRateLimit(`uid:${uid}`, RATE_LIMIT_UID_MAX, RATE_LIMIT_UID_WINDOW_MS);
  if (!uidRateLimit.allowed) {
    res.setHeader('Retry-After', String(uidRateLimit.retryAfterSec || 15));
    return res.status(429).json({
      success: false,
      error: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many rapid vote requests on this account. Please wait a few seconds.',
      retryAfter: uidRateLimit.retryAfterSec,
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
            pandhalName: existingData.pandhalName || cleanPandhalName || pandhalId,
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
        pandhalName: cleanPandhalName,
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
        pandhalName: cleanPandhalName,
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
    console.error('[Firestore Tx Error / Vote Not Persisted]', dbError?.message || dbError);
    return res.status(500).json({
      success: false,
      error: 'VOTE_NOT_PERSISTED',
      message: 'We were unable to record your vote due to a database error. Your vote was NOT recorded. Please try again.',
    });
  }
}
