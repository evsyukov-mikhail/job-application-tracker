import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { Response } from 'express';
import { JobApplicationDTO } from '../dtos/job-application.dto';
import { JobApplicationsService } from './job-applications.service';

@Controller('job-applications')
export class JobApplicationsController {

  constructor(
    private jobApplicationsService: JobApplicationsService,
  ) {}

  @Get()
  async getJobApplications(@Res() res: Response) {
    try {
      const jobApplications = await this.jobApplicationsService.findAllJobApplications();
      return res.status(200).json(jobApplications);
    } catch (error) {
      return res.status(400).json({ message: (error as Error).message });
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createJobApplication(@Res() res: Response, @Body() dto: JobApplicationDTO) {
    try {
      const createdJobApplication = await this.jobApplicationsService.createJobApplication(dto);
      return res.status(200).json(createdJobApplication);
    } catch (error) {
      return res.status(400).json({ message: (error as Error).message });
    }
  }

  @Put(':id')
  async updateJobApplicationStatus(@Res() res: Response) {
    return;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteJobApplication(@Res() res: Response, @Param('id') id: string) {
    try {
      const deletedJobApplication = await this.jobApplicationsService.deleteJobApplication(id);
      if (!deletedJobApplication) {
        throw new Error(`Job application with ID ${id} was not found`);
      }
      return res.status(200).json({ message: `Successfully deleted job application with ID ${id}` });
    } catch (error) {
      return res.status(400).json({ message: (error as Error).message });
    }
  }

}
