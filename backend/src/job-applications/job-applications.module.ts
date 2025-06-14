import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { jobApplicationsProviders } from "./job-applications.providers";
import { JobApplicationsController } from "./job-applications.controller";

@Module({
  imports: [DatabaseModule],
  controllers: [JobApplicationsController],
  providers: [
    ...jobApplicationsProviders,
  ]
})
export class JobApplicationsModule {}