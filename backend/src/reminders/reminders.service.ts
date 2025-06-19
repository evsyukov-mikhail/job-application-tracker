import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ReminderDTO } from 'src/dtos/reminder.dto';
import { Reminder } from 'src/interfaces/reminder.interface';

@Injectable()
export class RemindersService {
  constructor(
    @Inject('REMINDER_MODEL')
    private reminderModel: Model<Reminder>,
  ) {}

  async findAllReminders(userId: string): Promise<Reminder[]> {
    return this.reminderModel.find({ userId });
  }

  async createReminder(userId: string, dto: ReminderDTO): Promise<Reminder> {
    const reminder = new this.reminderModel({ ...dto, userId });
    return reminder.save();
  }
}
