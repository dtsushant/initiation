import { Injectable } from '@nestjs/common';
import { CacheEntry, ICacheService } from '../cache.interface';

const TTL_POLICIES: Record<string, number> = {
  'module-locks': 3600, // 1 hour
  session: 900, // 15 minutes
  'user-profile': 1800, // 30 minutes
};

function resolveTTL(key: string): number {
  for (const prefix in TTL_POLICIES) {
    if (key.startsWith(prefix)) {
      return TTL_POLICIES[prefix];
    }
  }
  return Infinity; // No expiry if no matching prefix
}

@Injectable()
export class LocalCacheService implements ICacheService {
  private cache = new Map<string, CacheEntry<any>>();

  constructor() {
    setInterval(() => this.cleanup(), 60_000); // cleanup every 60 seconds
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt && entry.expiresAt <= now) {
        this.cache.delete(key);
      }
    }
  }

  async get<T>(key: string): Promise<T | undefined> {
    const entry = this.cache.get(key);
    if (!entry || (entry.expiresAt && entry.expiresAt < Date.now())) {
      this.cache.delete(key);
      return undefined;
    }
    return entry.value;
  }

  async set<T>(key: string, value: T, ttlInSeconds?: number): Promise<void> {
    const ttl = ttlInSeconds ?? resolveTTL(key);
    const expiresAt = ttl !== Infinity ? Date.now() + ttl * 1000 : Infinity;
    this.cache.set(key, { value, expiresAt });
  }

  async clear(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clearAll(): Promise<void> {
    this.cache.clear();
  }
}
