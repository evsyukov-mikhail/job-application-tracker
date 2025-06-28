import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { Model } from 'mongoose';
import { ReminderDTO } from 'src/dtos/reminder.dto';
import { Reminder } from 'src/interfaces/reminder.interface';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { User } from 'src/interfaces/user.interface';
import { MailsService } from 'src/mails/mails.service';

@Injectable()
export class RemindersService {

  private readonly transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>;

  constructor(
    @Inject('REMINDER_MODEL')
    private readonly reminderModel: Model<Reminder>,
    @Inject('USER_MODEL')
    private readonly userModel: Model<User>,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly mailsService: MailsService,
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

  async findAllReminders(userId: string): Promise<Reminder[]> {
    return this.reminderModel.find({ userId });
  }

  async createReminder(userId: string, dto: ReminderDTO): Promise<Reminder> {
    this.mailsService.createMailReminder({
      userId,
      date: dto.date,
      subject: 'Reminder on your job application',
      text: `Hi. You have been reminded on your schedule "${dto.title}" at ${dto.date.toDateString()}`,
    });

    const reminder = new this.reminderModel({ ...dto, userId });
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
