export interface ICacheService {
  get<T>(key: string): Promise<T | undefined>;
  set<T>(key: string, value: T, ttlInSeconds?: number): Promise<void>;
  clear(key: string): Promise<void>;
  clearAll?(): Promise<void>;
}

export interface CacheEntry<T> {
  value: T;
  expiresAt?: number;
}
