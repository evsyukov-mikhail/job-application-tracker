import { Module } from '@nestjs/common';
import { RemindersController } from './reminders.controller';
import { RemindersService } from './reminders.service';
import { remindersProviders } from './reminders.providers';
import { DatabaseModule } from '../database/database.module';
import { CacheModule } from '../cache/cache.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [DatabaseModule, CacheModule],
  controllers: [RemindersController],
  providers: [RemindersService, ...remindersProviders]
})
export class RemindersModule {}
