import { Module } from '@nestjs/common';
import { JobApplicationsController } from './job-applications/job-applications.controller';
import { JobApplicationsModule } from './job-applications/job-applications.module';

@Module({
  imports: [JobApplicationsModule],
})
export class AppModule {}
