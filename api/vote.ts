import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHash } from 'crypto';
import { getAdminAuth, getAdminDb, getAdminAppCheck, FieldValue, Timestamp } from './_lib/firebaseAdmin';
import { 
  isValidPandhalId, 
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

  // 2. Client IP & In-Memory Rate Limiting Abuse Protection
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

  // 3. Fail-Closed Firebase App Check Bot Protection
  // Enforced by default; can ONLY be bypassed if APP_CHECK_ENFORCE === 'false' in offline dev/test config
  const enforceAppCheck = process.env.APP_CHECK_ENFORCE !== 'false';
  if (enforceAppCheck) {
    const appCheckToken = (req.headers['x-firebase-appcheck'] || req.headers['X-Firebase-AppCheck']) as string | undefined;
    if (!appCheckToken || typeof appCheckToken !== 'string' || appCheckToken.trim().length === 0) {
      return res.status(401).json({
        success: false,
        error: 'INVALID_APP_CHECK_TOKEN',
        message: 'Bot protection verification failed. Please refresh the page and try again.',
      });
    }

    const adminAppCheck = getAdminAppCheck();
    if (!adminAppCheck) {
      console.error('[APP_CHECK_CONFIG_ERROR] Admin App Check failed to initialize — rejecting request to preserve fail-closed policy.');
      return res.status(401).json({
        success: false,
        error: 'APP_CHECK_UNAVAILABLE',
        message: 'Bot protection is temporarily unavailable. Please try again shortly.',
      });
    }

    try {
      await adminAppCheck.verifyToken(appCheckToken.trim());
    } catch (appCheckErr) {
      return res.status(401).json({
        success: false,
        error: 'INVALID_APP_CHECK_TOKEN',
        message: 'Bot protection verification failed or expired. Please refresh the page.',
      });
    }
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
      message: 'Authentication token missing. Please sign in with Google to vote.',
    });
  }

  if (!pandhalId || !isValidPandhalId(pandhalId)) {
    return res.status(400).json({
      success: false,
      error: 'INVALID_PANDHAL',
      message: 'Invalid or unrecognized Pandhal ID selected.',
    });
  }

  // 5. Server-Side ID Token & Identity Verification (Google Sign-In)
  let decodedToken: any = null;
  const adminAuth = getAdminAuth();
  if (adminAuth) {
    try {
      decodedToken = await adminAuth.verifyIdToken(idToken);
    } catch (authError: any) {
      return res.status(401).json({
        success: false,
        error: 'INVALID_OR_EXPIRED_TOKEN',
        message: 'Your Google sign-in session has expired. Please sign in again.',
      });
    }
  }

  if (!decodedToken || !decodedToken.uid) {
    return res.status(401).json({
      success: false,
      error: 'INVALID_OR_EXPIRED_TOKEN',
      message: 'Unable to verify authentication. Please sign in with Google.',
    });
  }

  // Identity Check: Require verified Google account (allowlist google.com, reject everything else)
  const signInProvider = decodedToken.firebase?.sign_in_provider;
  if (signInProvider !== 'google.com') {
    console.info(`[AUTH_METRIC:GOOGLE_SIGN_IN_REQUIRED] Non-Google vote attempt intercepted for UID ${decodedToken.uid} (provider: ${signInProvider ?? 'undefined'})`);
    return res.status(401).json({
      success: false,
      error: 'GOOGLE_SIGN_IN_REQUIRED',
      message: 'To ensure fair community voting, please sign in with your Google account. Past votes remain securely counted.',
    });
  }

  const uid = decodedToken.uid;
  const email = decodedToken.email || '';
  const tokenName = decodedToken.name;
  const rawVoterName = typeof voterName === 'string' ? voterName.trim().slice(0, 80) : '';
  const verifiedVoterName = (typeof tokenName === 'string' && tokenName.trim().slice(0, 80)) || rawVoterName || email?.split('@')[0] || 'Devotee';
  const cleanPandhalName = typeof pandhalName === 'string' ? pandhalName.trim().slice(0, 100) : pandhalId;
  const voterDocId = `${EVENT_ID}_${uid}`;

  // DPDP Privacy Compliance: truncated, salted SHA-256 hash instead of raw IP storage
  const ipHash = createHash('sha256').update(`${clientIp}:ganapathi2026_salt`).digest('hex').substring(0, 16);

  // 6. UID-based Rate Limiter (in-memory burst limit)
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

  // 7. Atomic Server-Side Firestore Transaction (Single source of write truth)
  try {
    const adminDb = getAdminDb();
    if (!adminDb) {
      throw new Error('ADMIN_DB_UNAVAILABLE');
    }

    const launchConfigRef = adminDb.doc('config/launch');
    const voterRef = adminDb.doc(`voters/${voterDocId}`);
    const shardIndex = getDeterministicShardIndex(uid, pandhalId);
    const shardRef = adminDb.doc(`counters/${pandhalId}/shards/shard_${shardIndex}`);

    const txResult = await adminDb.runTransaction(async (transaction) => {
      // Step A: Read launch config (server-clock source of truth, fail-closed)
      const launchSnap = await transaction.get(launchConfigRef);
      if (!launchSnap.exists) {
        console.error('[LAUNCH_CONFIG_MISSING] /config/launch document not found — rejecting to preserve fail-closed policy.');
        return { status: 'VOTING_NOT_STARTED' as const };
      }

      const launchData = launchSnap.data();
      const launchTime = launchData?.launchTime;
      let launchEpochMs = 0;
      if (launchTime && typeof launchTime.toMillis === 'function') {
        launchEpochMs = launchTime.toMillis();
      } else if (launchData?.launchTimeIso) {
        launchEpochMs = new Date(launchData.launchTimeIso).getTime();
      }

      if (launchEpochMs <= 0) {
        console.error('[LAUNCH_CONFIG_INVALID] /config/launch has no usable timestamp — rejecting to preserve fail-closed policy.');
        return { status: 'VOTING_NOT_STARTED' as const };
      }

      if (Date.now() < launchEpochMs) {
        return { status: 'VOTING_NOT_STARTED' as const };
      }

      // Step B: Read voter record (assert user has not voted yet)
      const voterSnap = await transaction.get(voterRef);
      if (voterSnap.exists) {
        const existingData = voterSnap.data();
        if (existingData?.pandhalId === pandhalId) {
          return {
            status: 'IDEMPOTENT_SUCCESS' as const,
            pandhalName: existingData.pandhalName || cleanPandhalName,
          };
        }
        return {
          status: 'ALREADY_VOTED' as const,
          previousPandhalId: existingData?.pandhalId,
          previousPandhalName: existingData?.pandhalName || 'another Bappa',
        };
      }

      // Step C: Atomically write voter document, increment shard count by +1, and increment top-level counter
      transaction.set(voterRef, {
        uid,
        email: email || '',
        voterName: verifiedVoterName,
        pandhalId,
        pandhalName: cleanPandhalName,
        eventId: EVENT_ID,
        votedAt: Timestamp.now(),
        ipHash,
      });

      transaction.set(shardRef, {
        count: FieldValue.increment(1),
        lastUpdated: Timestamp.now(),
      }, { merge: true });

      const topCounterRef = adminDb.doc(`counters/${pandhalId}`);
      transaction.set(topCounterRef, {
        totalVotes: FieldValue.increment(1),
        lastUpdated: Timestamp.now(),
      }, { merge: true });

      return { status: 'SUCCESS' as const };
    });

    if (txResult.status === 'VOTING_NOT_STARTED') {
      return res.status(403).json({
        success: false,
        error: 'VOTING_NOT_STARTED',
        message: 'Voting has not officially opened yet. Please check back at the scheduled launch time.',
      });
    }

    if (txResult.status === 'ALREADY_VOTED') {
      return res.status(409).json({
        success: false,
        error: 'ALREADY_VOTED',
        message: `Your Google account has already cast its ballot for "${txResult.previousPandhalName}". Each account is permitted exactly 1 vote.`,
        previousPandhalId: txResult.previousPandhalId,
        previousPandhalName: txResult.previousPandhalName,
      });
    }

    if (txResult.status === 'IDEMPOTENT_SUCCESS') {
      console.info(`[API_VOTE_IDEMPOTENT] Idempotent vote re-asserted for UID ${uid.slice(0, 8)}... on ${pandhalId}`);
      return res.status(200).json({
        success: true,
        message: `Your vote for ${txResult.pandhalName} is successfully locked!`,
        pandhalId,
        pandhalName: txResult.pandhalName,
        idempotent: true,
      });
    }

    console.info(`[API_VOTE_COMMITTED] Atomic ballot committed for UID ${uid.slice(0, 8)}... -> ${pandhalId} (shard_${shardIndex}, topCounter +1)`);

    return res.status(200).json({
      success: true,
      message: `Your vote for ${cleanPandhalName} is successfully locked!`,
      pandhalId,
      pandhalName: cleanPandhalName,
      idempotent: false,
    });
  } catch (dbError: any) {
    console.error('[API Vote Transaction Failure]:', dbError?.message || dbError);
    return res.status(500).json({
      success: false,
      error: 'TRANSACTION_FAILED',
      message: 'We were unable to record your vote due to a temporary database issue. Please try again.',
    });
  }
}
