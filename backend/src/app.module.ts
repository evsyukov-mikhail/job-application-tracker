import { Module } from '@nestjs/common';
import { JobApplicationsController } from './job-applications/job-applications.controller';
import { JobApplicationsModule } from './job-applications/job-applications.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [JobApplicationsModule, AuthModule],
})
export class AppModule {}
