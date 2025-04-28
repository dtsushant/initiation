import { Module } from '@nestjs/common';
import { LocalCacheService } from './service/cache-local.service';
import { RedisCacheService } from './service/cache-redis.service';
import { CacheServiceProvider } from './cache.factory';

@Module({
  providers: [
    LocalCacheService,
    //RedisCacheService,
    CacheServiceProvider,
  ],
  exports: ['ICacheService'],
})
export class CacheModule {}
