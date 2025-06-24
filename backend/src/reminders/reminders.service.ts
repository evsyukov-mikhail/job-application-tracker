import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { Model } from 'mongoose';
import { ReminderDTO } from 'src/dtos/reminder.dto';
import { Reminder } from 'src/interfaces/reminder.interface';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { User } from 'src/interfaces/user.interface';

@Injectable()
export class RemindersService {

  private readonly transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>;

  constructor(
    @Inject('REMINDER_MODEL')
    private reminderModel: Model<Reminder>,
    @Inject('USER_MODEL')
    private userModel: Model<User>,
    private schedulerRegistry: SchedulerRegistry,
  ) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.SERVICE_EMAIL,
        clientId: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      }
    })
  }

  async findAllReminders(userId: string): Promise<Reminder[]> {
    return this.reminderModel.find({ userId });
  }

  async createReminder(userId: string, dto: ReminderDTO): Promise<Reminder> {
    const job = new CronJob(dto.date, async () => {
      const receiverEmail = await this.getUserEmailById(userId);

      const info = await this.transporter.sendMail({
        from: process.env.SERVICE_EMAIL,
        to: receiverEmail,
        subject: 'Reminder on your job application',
        text: `Hi. You have been reminded on your schedule "${dto.title}" at ${dto.date.toDateString()}`,
      });

      // For development only
      console.log(`Message preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    });

    const jobName = `${userId}:${Date.now().toString()}`;

    this.schedulerRegistry.addCronJob(jobName, job as any);
    job.start();

    const reminder = new this.reminderModel({
      ...dto,
      userId
    });
    return reminder.save();
  }

  private async getUserEmailById(userId: string): Promise<string> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`Failed to find user by ID ${userId}`);
    }

    return user.email;
  }
}
