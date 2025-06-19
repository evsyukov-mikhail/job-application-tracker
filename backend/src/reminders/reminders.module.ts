import { Module } from '@nestjs/common';
import { RemindersController } from './reminders.controller';
import { RemindersService } from './reminders.service';
import { remindersProviders } from './reminders.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [RemindersController],
  providers: [RemindersService, ...remindersProviders]
})
export class RemindersModule {}
