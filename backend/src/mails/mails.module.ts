import { Module } from '@nestjs/common';
import { MailsService } from './mails.service';
import { mailsProviders } from './mails.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [MailsService, ...mailsProviders]
})
export class MailsModule {}
