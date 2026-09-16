import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAdminDb } from './_lib/firebaseAdmin';
import { VALID_PANDHAL_IDS } from './_lib/constants';

interface CachedCounters {
  counts: Record<string, number>;
  totalVotes: number;
  timestamp: number;
  updatedAt: string;
}

// In-instance memory micro-cache (reduces duplicate Firestore reads across concurrent requests to same container)
let instanceCache: CachedCounters | null = null;
const INSTANCE_CACHE_TTL_MS = 5000; // 5 seconds

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cache-Control');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'METHOD_NOT_ALLOWED',
      message: 'Only GET requests are supported.',
    });
  }

  // 2. Edge CDN Caching Headers (15s maxage + 15s stale-while-revalidate for tight live updates)
  res.setHeader('Cache-Control', 'public, s-maxage=15, stale-while-revalidate=15');

  const now = Date.now();

  // Check in-instance micro-cache first
  if (instanceCache && now - instanceCache.timestamp < INSTANCE_CACHE_TTL_MS) {
    res.setHeader('X-Cache-Status', 'HIT-INSTANCE');
    console.info(`[API_COUNTERS_HIT] Container micro-cache hit: totalVotes ${instanceCache.totalVotes} (age: ${Math.round((now - instanceCache.timestamp) / 1000)}s)`);
    return res.status(200).json({
      success: true,
      counts: instanceCache.counts,
      totalVotes: instanceCache.totalVotes,
      updatedAt: instanceCache.updatedAt,
    });
  }

  try {
    const counts: Record<string, number> = {};
    VALID_PANDHAL_IDS.forEach((id) => {
      counts[id] = 0;
    });

    const adminDb = getAdminDb();
    if (!adminDb) {
      throw new Error('ADMIN_DB_UNAVAILABLE');
    }

    // Query both shard subcollections and top-level counters in parallel
    const [shardsSnapshot, countersSnapshot] = await Promise.all([
      adminDb.collectionGroup('shards').get().catch(() => null),
      adminDb.collection('counters').get().catch(() => null),
    ]);

    let shardSumCount = 0;
    if (shardsSnapshot) {
      shardsSnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const count = typeof data.count === 'number' ? data.count : 0;
        
        const pathSegments = docSnap.ref.path.split('/');
        const pandhalId = pathSegments[1];

        if (pandhalId && counts[pandhalId] !== undefined) {
          counts[pandhalId] += count;
          shardSumCount += count;
        }
      });
    }

    let topLevelSumCount = 0;
    if (countersSnapshot) {
      countersSnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const pandhalId = docSnap.id;
        const topTotal = typeof data.totalVotes === 'number'
          ? data.totalVotes
          : (typeof data.count === 'number' ? data.count : 0);

        if (pandhalId && counts[pandhalId] !== undefined) {
          counts[pandhalId] = Math.max(counts[pandhalId], topTotal);
          topLevelSumCount += topTotal;
        }
      });
    }

    let totalVotes = 0;
    Object.values(counts).forEach((val) => {
      totalVotes += val;
    });

    const updatedAt = new Date().toISOString();
    instanceCache = {
      counts,
      totalVotes,
      timestamp: now,
      updatedAt,
    };

    console.info(`[API_COUNTERS_FETCH] Fresh Firestore read committed: totalVotes ${totalVotes} (shardsSum: ${shardSumCount}, topSum: ${topLevelSumCount})`);

    res.setHeader('X-Cache-Status', 'MISS-FETCHED');
    return res.status(200).json({
      success: true,
      counts,
      totalVotes,
      updatedAt,
    });
  } catch (err: any) {
    console.error('[Counters Error] Failed to aggregate shards:', err);

    // If Firestore fails or shards are not yet created, return clean 0s rather than 500
    const zeroCounts: Record<string, number> = {};
    VALID_PANDHAL_IDS.forEach((id) => {
      zeroCounts[id] = 0;
    });

    try {
      res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=10');
      return res.status(200).json({
        success: true,
        counts: instanceCache ? instanceCache.counts : zeroCounts,
        totalVotes: instanceCache ? instanceCache.totalVotes : 0,
        updatedAt: new Date().toISOString(),
        fallback: true,
      });
    } catch {
      return res.status(200).end();
    }
  }
}
