import { Connection } from "mongoose";
import { JobApplicationSchema } from "src/schemas/job-application.schema";
import { UserSchema } from "src/schemas/user.schema";

export const jobApplicationsProviders = [
  {
    provide: 'JOB_APPLICATION_MODEL',
    useFactory: (connection: Connection) => connection.model('JobApplication', JobApplicationSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'USER_MODEL',
    useFactory: (connection: Connection) => connection.model('User', UserSchema),
    inject: ['DATABASE_CONNECTION'],
  }
];