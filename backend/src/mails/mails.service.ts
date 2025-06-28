import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { Model } from 'mongoose';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { User } from 'src/interfaces/user.interface';

@Injectable()
export class MailsService {
  private readonly transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>;

  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<User>,
    private schedulerRegistry: SchedulerRegistry
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      }
    });
  }

  createMailReminder(userId: string, date: Date, subject: string, text: string): void {
    const job = new CronJob(date, async () => {
      const receiverEmail = await this.getUserEmailById(userId);

      await this.transporter.sendMail({
        from: process.env.EMAIL,
        to: receiverEmail,
        subject,
        text,
      });
    });

    const jobName = `${userId}:${Date.now().toString()}`;

    this.schedulerRegistry.addCronJob(jobName, job as any);
    job.start();
  }

  private async getUserEmailById(userId: string): Promise<string> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`Failed to find user by ID ${userId}`);
    }

    return user.email;
  }
}
