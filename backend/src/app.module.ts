import { Module } from '@nestjs/common';
import { JobApplicationsController } from './job-applications/job-applications.controller';
import { JobApplicationsModule } from './job-applications/job-applications.module';
import { AuthModule } from './auth/auth.module';
import { CryptoService } from './crypto/crypto.service';
import { CryptoModule } from './crypto/crypto.module';
import { CacheModule } from './cache/cache.module';
import { RemindersModule } from './reminders/reminders.module';

@Module({
  imports: [JobApplicationsModule, AuthModule, CryptoModule, CacheModule, RemindersModule],
  providers: [CryptoService],
})
export class AppModule {}
