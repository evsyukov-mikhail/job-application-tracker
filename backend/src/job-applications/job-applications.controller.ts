import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { JobApplicationDTO } from 'src/dtos/job-application.dto';
import { JobApplicationsService } from './job-applications.service';

@Controller('job-applications')
export class JobApplicationsController {

  constructor(
    private jobApplicationsService: JobApplicationsService,
  ) {}

  @Get()
  async getJobApplications(@Res() res: Response) {
    const jobApplications = await this.jobApplicationsService.findAllJobApplications();
    return res.status(200).json(jobApplications);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createJobApplication(@Res() res: Response, @Body() dto: JobApplicationDTO) {
    const createdJobApplication = await this.jobApplicationsService.createJobApplication(dto);
    return res.status(200).json(createdJobApplication);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteJobApplication(@Res() res: Response, @Param('id') id: string) {
    const deletedJobApplication = await this.jobApplicationsService.deleteJobApplication(id);
    if (!deletedJobApplication) {
      return res.status(404).json({ message: `Job application with ID ${id} was not found` });
    }
    return res.status(200).json({ message: `Successfully deleted job application with ID ${id}` })
  }

}
