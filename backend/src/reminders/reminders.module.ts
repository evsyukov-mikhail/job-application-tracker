import { Module } from '@nestjs/common';
import { RemindersController } from './reminders.controller';
import { RemindersService } from './reminders.service';
import { remindersProviders } from './reminders.providers';
import { DatabaseModule } from '../database/database.module';
import { CacheService } from '../cache/cache.service';

@Module({
  imports: [DatabaseModule],
  controllers: [RemindersController],
  providers: [RemindersService, CacheService, ...remindersProviders]
})
export class RemindersModule {}
