import { Module } from '@nestjs/common';
import { JobApplicationsController } from './job-applications/job-applications.controller';
import { JobApplicationsModule } from './job-applications/job-applications.module';
import { AuthModule } from './auth/auth.module';
import { CryptoService } from './crypto/crypto.service';
import { CryptoModule } from './crypto/crypto.module';
import { CacheModule } from '@nestjs/cache-manager';
import { Keyv, createKeyv } from '@keyv/redis';
import { CacheableMemory } from 'cacheable';

@Module({
  imports: [
    JobApplicationsModule, AuthModule, CryptoModule,
    CacheModule.register({
      isGlobal: true,
      useFactory: async () => ({
        stores: [
          new Keyv({
            store: new CacheableMemory({ ttl: 60000, lruSize: 5000 }),
          }),
          createKeyv(`${process.env.REDIS_CONNECTION_STRING}`),
        ],
      })
    })
  ],
  providers: [CryptoService],
})
export class AppModule {}
