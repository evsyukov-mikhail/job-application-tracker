import { Inject, Injectable } from '@nestjs/common';
import { Cacheable, Keyv } from 'cacheable';
import Redis from 'ioredis';

@Injectable()
export class CacheService {
  constructor(
    @Inject('CACHE_INSTANCE') private readonly keyv: Keyv,
    public readonly redisStore: Redis | undefined,
  ) {
    const keyvStore = keyv.opts.store;

    if (!keyvStore || !(keyvStore as any).constructor || (keyvStore as any).constructor.name !== 'Redis') {
      redisStore = undefined;
      return;
    }

    const potentialRedisClient = keyvStore as unknown as Redis;

    if (!potentialRedisClient || typeof potentialRedisClient.status !== 'string' || typeof potentialRedisClient.on !== 'function') {
      redisStore = undefined;
      return;
    }

    this.redisStore = potentialRedisClient;
    this.redisStore.on('error', err => console.error(err));
  }
}
