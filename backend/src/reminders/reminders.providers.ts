import { Connection } from "mongoose";
import { ReminderSchema } from "src/schemas/reminder.schema";
import { UserSchema } from "src/schemas/user.schema";

export const remindersProviders = [
  {
    provide: 'REMINDER_MODEL',
    useFactory: (connection: Connection) => connection.model('Reminder', ReminderSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'USER_MODEL',
    useFactory: (connection: Connection) => connection.model('User', UserSchema),
    inject: ['DATABASE_CONNECTION'],
  }
];