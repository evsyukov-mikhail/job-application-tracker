import { Module } from '@nestjs/common';
import { RemindersController } from './reminders.controller';
import { RemindersService } from './reminders.service';
import { remindersProviders } from './reminders.providers';

@Module({
  controllers: [RemindersController],
  providers: [RemindersService, ...remindersProviders]
})
export class RemindersModule {}
