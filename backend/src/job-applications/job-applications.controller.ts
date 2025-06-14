import { Controller, Delete, Get, Post } from '@nestjs/common';

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

  @Delete()
  async deleteJobApplication() {
    return;
  }

}
