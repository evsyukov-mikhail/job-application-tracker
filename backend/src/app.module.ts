import { Module } from '@nestjs/common';
import { JobApplicationsController } from './job-applications/job-applications.controller';

@Module({
  imports: [],
  controllers: [JobApplicationsController],
})
export class AppModule {}
