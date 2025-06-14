import { Connection } from "mongoose";
import { JobApplicationSchema } from "src/schemas/job-application.schema";

export const jobApplicationsProviders = [
  {
    provide: 'JOB_APPLICATION_MODEL',
    useFactory: (connection: Connection) => connection.model('JobApplication', JobApplicationSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];