import type { VercelRequest, VercelResponse } from '@vercel/node';
import { adminDb } from './_lib/firebaseAdmin';
import { VALID_PANDHAL_IDS } from './_lib/constants';

interface CachedCounters {
  counts: Record<string, number>;
  totalVotes: number;
  timestamp: number;
  updatedAt: string;
}

// In-instance memory micro-cache (reduces duplicate Firestore reads across concurrent requests to same container)
let instanceCache: CachedCounters | null = null;
const INSTANCE_CACHE_TTL_MS = 15000; // 15 seconds

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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

  // 2. Edge CDN Caching Headers
  // s-maxage=20: Vercel Edge CDN caches for 20 seconds
  // stale-while-revalidate=60: Serves stale copy instantly up to 60s while refreshing in background
  res.setHeader('Cache-Control', 'public, s-maxage=20, stale-while-revalidate=60');

  const now = Date.now();

  // Check in-instance micro-cache first
  if (instanceCache && now - instanceCache.timestamp < INSTANCE_CACHE_TTL_MS) {
    res.setHeader('X-Cache-Status', 'HIT-INSTANCE');
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

    // Query all shard subcollections across all pandhals
    const shardsSnapshot = await adminDb.collectionGroup('shards').get();

    shardsSnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const count = typeof data.count === 'number' ? data.count : 0;
      
      const pathSegments = docSnap.ref.path.split('/');
      const pandhalId = pathSegments[1];

      if (pandhalId && counts[pandhalId] !== undefined) {
        counts[pandhalId] += count;
      }
    });

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

    res.setHeader('X-Cache-Status', 'MISS-FETCHED');
    return res.status(200).json({
      success: true,
      counts,
      totalVotes,
      updatedAt,
    });
  } catch (err: any) {
    console.error('[Counters Error] Failed to aggregate shards:', err);

    // If Firestore fails but we have stale cache, serve it gracefully
    if (instanceCache) {
      res.setHeader('X-Cache-Status', 'STALE-FALLBACK');
      return res.status(200).json({
        success: true,
        counts: instanceCache.counts,
        totalVotes: instanceCache.totalVotes,
        updatedAt: instanceCache.updatedAt,
        stale: true,
      });
    }

    return res.status(500).json({
      success: false,
      error: 'AGGREGATION_FAILED',
      message: 'Unable to retrieve live vote counts at this moment.',
    });
  }
}
