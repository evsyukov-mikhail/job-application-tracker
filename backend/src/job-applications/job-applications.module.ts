import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { jobApplicationsProviders } from "./job-applications.providers";
import { JobApplicationsController } from "./job-applications.controller";
import { JobApplicationsService } from './job-applications.service';

@Module({
  imports: [DatabaseModule],
  controllers: [JobApplicationsController],
  providers: [
    JobApplicationsService,
    ...jobApplicationsProviders,
  ]
})
export class JobApplicationsModule {}