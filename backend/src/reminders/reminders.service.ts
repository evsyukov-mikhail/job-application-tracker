import { Inject, Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { Model } from 'mongoose';
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
    const jobs = this.schedulerRegistry.getCronJobs();
    jobs.forEach((v, k, _) => console.log(`${k}: ${v}`));

    return this.reminderModel.find({ userId });
  }

  async createReminder(userId: string, dto: ReminderDTO): Promise<Reminder> {
    const reminder = new this.reminderModel({ ...dto, userId });
    const created = await reminder.save();

    const job = new CronJob(this.getCronPatternFromDate(dto.date), () => {
      console.log(`Created cron job: userId=${userId}, reminderId=${created._id}`);
    });

    const jobName = `${userId}:${created._id}`;

    this.schedulerRegistry.addCronJob(jobName, job as any);
    job.start();

    return created;
  }

  private getCronPatternFromDate(date: Date): string {
    const sec: string = String(date.getSeconds()) || '*';
    const min: string = String(date.getMinutes()) || '*';
    const hr: string = String(date.getHours()) || '*';

    const dayOfMon: string = String(date.getDate()) || '*';
    const mon: string = String(date.getDate()) || '*';
    const dayOfWeek: string = String(date.getDay()) || '*';

    return `${sec} ${min} ${hr} ${dayOfMon} ${mon} ${dayOfWeek}`;
  }
}
