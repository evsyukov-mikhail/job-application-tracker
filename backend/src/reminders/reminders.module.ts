import { Module } from '@nestjs/common';
import { RemindersController } from './reminders.controller';
import { RemindersService } from './reminders.service';
import { remindersProviders } from './reminders.providers';
import { DatabaseModule } from '../database/database.module';
import { CacheModule } from '../cache/cache.module';
import { CacheService } from 'src/cache/cache.service';
import { MailsService } from 'src/mails/mails.service';
import { MailsModule } from 'src/mails/mails.module';

@Module({
  imports: [DatabaseModule, CacheModule, MailsModule],
  controllers: [RemindersController],
  providers: [RemindersService, CacheService, MailsService, ...remindersProviders]
})
export class RemindersModule {}
