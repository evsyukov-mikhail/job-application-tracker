import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { ReminderDTO } from '../dtos/reminder.dto';
import { Reminder } from '../interfaces/reminder.interface';
import { User } from '../interfaces/user.interface';
import { MailsService } from '../mails/mails.service';

@Injectable()
export class RemindersService {
  constructor(
    @Inject('REMINDER_MODEL')
    private readonly reminderModel: Model<Reminder>,
    @Inject('USER_MODEL')
    private readonly userModel: Model<User>,
    private readonly mailsService: MailsService,
  ) {}

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
