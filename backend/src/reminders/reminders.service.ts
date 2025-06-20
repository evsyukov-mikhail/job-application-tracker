import { Inject, Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { Model } from 'mongoose';
import { databaseProviders } from 'src/database/database.providers';
import { ReminderDTO } from 'src/dtos/reminder.dto';
import { Reminder } from 'src/interfaces/reminder.interface';

@Injectable()
export class RemindersService {
  constructor(
    @Inject('REMINDER_MODEL')
    private reminderModel: Model<Reminder>,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  async findAllReminders(userId: string): Promise<Reminder[]> {
    return this.reminderModel.find({ userId });
  }

  async createReminder(userId: string, dto: ReminderDTO): Promise<Reminder> {
    const job = new CronJob(dto.date, () => {
      console.log(`Cron job finished!`);
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
}
