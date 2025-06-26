import { createKeyv } from '@keyv/redis';
import { Module } from '@nestjs/common';
import { Cacheable } from 'cacheable';
import { CacheService } from './cache.service';

@Module({
  providers: [
    CacheService,
    {
      provide: 'CACHE_INSTANCE',
      useFactory: () => {
        const secondary = createKeyv(`${process.env.REDIS_CONNECTION_STRING}`);
        return new Cacheable({ secondary, ttl: '5m' });
      },
    },
  ],
  exports: ['CACHE_INSTANCE'],
})
export class CacheModule {}
