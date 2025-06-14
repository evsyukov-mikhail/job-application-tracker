import { Controller, Get, Post } from '@nestjs/common';

@Controller('job-applications')
export class JobApplicationsController {

  @Get()
  async getJobApplications() {
    return;
  }

  @Post()
  async createJobApplication() {
    return;
  }

}
