import { Module } from '@nestjs/common';
import { JobApplicationsModule } from './job-applications/job-applications.module';
import { AuthModule } from './auth/auth.module';
import { CryptoService } from './crypto/crypto.service';
import { CryptoModule } from './crypto/crypto.module';
import { CacheModule } from './cache/cache.module';
import { RemindersModule } from './reminders/reminders.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    JobApplicationsModule,
    AuthModule,
    CryptoModule,
    CacheModule,
    RemindersModule,
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
  ],
  providers: [CryptoService],
})
export class AppModule {}
