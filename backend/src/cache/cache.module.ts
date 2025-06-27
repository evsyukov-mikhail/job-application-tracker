import { createKeyv } from '@keyv/redis';
import { Module } from '@nestjs/common';
import { Cacheable } from 'cacheable';
import { CacheService } from './cache.service';

@Module({
  providers: [
    CacheService,
    {
      provide: 'CACHE_INSTANCE',
      useFactory: () => createKeyv(`${process.env.REDIS_CONNECTION_STRING}`)
    },
  ],
  exports: ['CACHE_INSTANCE'],
})
export class CacheModule {}
