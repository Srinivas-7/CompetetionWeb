/**
 * In-memory sliding window rate limiter per Vercel serverless instance.
 * Serves as a fast, zero-cost edge defense layer against rapid script spam.
 * (Note: Distributed uniqueness & idempotency are strictly guaranteed by Firestore atomic transactions).
 */
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const ipBuckets = new Map<string, RateLimitRecord>();
const CLEANUP_INTERVAL = 60000; // 1 minute
let lastCleanup = Date.now();

export function checkRateLimit(
  ip: string,
  limit: number = 10,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; retryAfterSec?: number } {
  const now = Date.now();

  // Periodic memory cleanup
  if (now - lastCleanup > CLEANUP_INTERVAL) {
    for (const [key, record] of ipBuckets.entries()) {
      if (now > record.resetTime) {
        ipBuckets.delete(key);
      }
    }
    lastCleanup = now;
  }

  const record = ipBuckets.get(ip);

  if (!record || now > record.resetTime) {
    ipBuckets.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { allowed: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    const retryAfterSec = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSec };
  }

  record.count += 1;
  return { allowed: true, remaining: limit - record.count };
}
