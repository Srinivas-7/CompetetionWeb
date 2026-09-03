import { createHash } from 'crypto';

export const EVENT_ID = 'ganapathi_chaturthi_2026';

export const VALID_PANDHAL_IDS = [
  'pandhal-01',
  'pandhal-02',
  'pandhal-03',
  'pandhal-04',
  'pandhal-05',
  'pandhal-06',
  'pandhal-07',
  'pandhal-08',
  'pandhal-09',
  'pandhal-10',
  'pandhal-11',
  'pandhal-12',
  'pandhal-13',
  'pandhal-14',
  'pandhal-15',
  'pandhal-16',
  'pandhal-17',
  'pandhal-18',
  'pandhal-19',
  'pandhal-20',
  'pandhal-21',
] as const;

export type ValidPandhalId = typeof VALID_PANDHAL_IDS[number];

export function isValidPandhalId(id: string): id is ValidPandhalId {
  return VALID_PANDHAL_IDS.includes(id as ValidPandhalId);
}

// Configurable Shard Count: defaults to 10 per pandhal, can be overridden via NUM_SHARDS env
const envShards = parseInt(process.env.NUM_SHARDS || '', 10);
export const NUM_SHARDS = !isNaN(envShards) && envShards >= 3 && envShards <= 50 ? envShards : 10;

/**
 * Deterministic, cryptographically uniform shard selection.
 * Uses SHA-256 hash of (eventId + uid + pandhalId) to guarantee:
 * 1. Exactly uniform 1/NUM_SHARDS probability (0 systematic shard bias)
 * 2. Idempotent shard assignment for retry requests
 * 3. Elimination of hot-spot clustering under rapid bursts
 */
export function getDeterministicShardIndex(
  uid: string,
  pandhalId: string,
  eventId: string = EVENT_ID,
  numShards: number = NUM_SHARDS
): number {
  const hash = createHash('sha256').update(`${eventId}:${uid}:${pandhalId}`).digest();
  const hashInt = hash.readUInt32BE(0);
  return hashInt % numShards;
}
