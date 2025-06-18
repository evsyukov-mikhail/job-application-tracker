import { Connection } from "mongoose";
import { JobApplicationSchema } from "../schemas/job-application.schema";
import { UserSchema } from "../schemas/user.schema";

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