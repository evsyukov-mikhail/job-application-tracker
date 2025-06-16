import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { JobApplicationDTO, Status } from '../dtos/job-application.dto';
import { JobApplicationsService } from './job-applications.service';
import { JobApplicationStatusDTO } from 'src/interfaces/job-application-status.dto';

@Controller('job-applications')
export class JobApplicationsController {

  constructor(
    private jobApplicationsService: JobApplicationsService,
  ) {}

  @Get()
  async findAllJobApplications(@Res() res: Response, @Query('status') status: Status) {
    try {
      if (!status) {
        const jobApplications = await this.jobApplicationsService.findAllJobApplications();
        return res.status(200).json(jobApplications);
      }

      if (!Object.values(Status).includes(status)) {
        throw new Error(`Failed to find status ${status}`);
      }
      
      const jobApplicationsByStatus = await this.jobApplicationsService.findJobApplicationsByStatus(status);
      return res.status(200).json(jobApplicationsByStatus);
    } catch (error) {
      return res.status(400).json({ message: (error as Error).message });
    }
  }

  @Get('/search')
  async findJobApplicationsByKeywords(
    @Res() res: Response,
    @Query('companyName') companyName: string,
    @Query('jobTitle') jobTitle: string
  ) {
    try {
      const jobApplications = await this.jobApplicationsService.findJobApplicationsByKeywords(companyName, jobTitle);
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
  async updateJobApplicationStatus(
    @Res() res: Response,
    @Body() dto: JobApplicationStatusDTO,
    @Param('id') id: string
  ) {
    try {
      const updatedJobApplication = await this.jobApplicationsService.updateJobApplicationStatus(id, dto.status);
      if (!updatedJobApplication) {
        throw new Error(`Job application with ID ${id} was not found`);
      }
      return res.status(200).json(updatedJobApplication);
    } catch (error) {
      return res.status(400).json({ message: (error as Error).message });
    }
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
