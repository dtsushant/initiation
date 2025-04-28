import { LocalCacheService } from './service/cache-local.service';
import { RedisCacheService } from './service/cache-redis.service';
import { Provider } from '@nestjs/common';

export const CacheServiceProvider: Provider = {
  provide: 'ICacheService',
  useFactory: (
    localCacheService: LocalCacheService,
    //redisCacheService: RedisCacheService
  ) => {
    /*if (process.env.CACHE_BACKEND === 'redis') {
            return redisCacheService;
        }*/
    return localCacheService;
  },
  inject: [LocalCacheService],
  //inject: [LocalCacheService, RedisCacheService],
};
