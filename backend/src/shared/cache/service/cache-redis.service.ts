import { Injectable } from '@nestjs/common';
import { ICacheService } from '../cache.interface';

//TODO:- implement redis later
interface Redis {
  get<T>(key: string): T;
  set<T>(key: string, value: T, meta: string, ttl?: number): void;
  del(key: string): void;
}
@Injectable()
export class RedisCacheService implements ICacheService {
  constructor(private readonly redis: Redis) {} // e.g., ioredis

  async get<T>(key: string): Promise<T | undefined> {
    return await this.redis.get(key);
    //return value ? JSON.parse(value) : undefined;
  }

  async set<T>(key: string, value: T, ttlInSeconds = 300): Promise<void> {
    await this.redis.set(key, JSON.stringify(value), 'EX', ttlInSeconds);
  }

  async clear(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
