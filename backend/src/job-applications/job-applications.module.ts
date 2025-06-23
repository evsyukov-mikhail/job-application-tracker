import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { jobApplicationsProviders } from "./job-applications.providers";
import { JobApplicationsController } from "./job-applications.controller";
import { JobApplicationsService } from './job-applications.service';
import { CacheModule } from "../cache/cache.module";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { CacheService } from "src/cache/cache.service";

@Module({
  imports: [EventEmitterModule.forRoot(), DatabaseModule, CacheModule],
  controllers: [JobApplicationsController],
  providers: [JobApplicationsService, CacheService, ...jobApplicationsProviders]
})
export class JobApplicationsModule {}