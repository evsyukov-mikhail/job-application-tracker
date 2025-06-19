import { Connection } from "mongoose";
import { ReminderSchema } from "src/schemas/reminder.schema";

export const remindersProviders = [
  {
    provide: 'REMINDER_MODEL',
    useFactory: (connection: Connection) => connection.model('Reminder', ReminderSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];