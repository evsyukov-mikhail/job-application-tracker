import { Module } from '@nestjs/common';
import { JobApplicationsController } from './job-applications/job-applications.controller';
import { JobApplicationsModule } from './job-applications/job-applications.module';
import { AuthModule } from './auth/auth.module';
import { CryptoService } from './crypto/crypto.service';

@Module({
  imports: [JobApplicationsModule, AuthModule],
  providers: [CryptoService],
})
export class AppModule {}
