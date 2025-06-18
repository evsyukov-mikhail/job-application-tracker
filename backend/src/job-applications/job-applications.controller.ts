import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { JobApplicationDTO, Status } from '../dtos/job-application.dto';
import { JobApplicationsService } from './job-applications.service';
import { JobApplicationStatusDTO } from '../dtos/job-application-status.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('job-applications')
export class JobApplicationsController {

  constructor(
    private jobApplicationsService: JobApplicationsService,
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  async findAllJobApplications(
    @Req() req: Request,
    @Res() res: Response,
    @Query('status') status: Status
  ) {
    try {
      const { userId } = req.body;

      if (!status) {
        const jobApplications = await this.jobApplicationsService.
          findAllJobApplications(userId);
        return res.status(200).json(jobApplications);
      }

      if (!Object.values(Status).includes(status)) {
        throw new Error(`Failed to find status ${status}`);
      }
      
      const jobApplicationsByStatus = await this.jobApplicationsService.
        findJobApplicationsByStatus(userId, status);
      return res.status(200).json(jobApplicationsByStatus);
    } catch (error) {
      return res.status(400).json({ message: (error as Error).message });
    }
  }

  @UseGuards(AuthGuard)
  @Get('/search')
  async findJobApplicationsByKeywords(
    @Req() req: Request,
    @Res() res: Response,
    @Query('companyName') companyName: string,
    @Query('jobTitle') jobTitle: string
  ) {
    try {
      const { userId } = req.body;

      const jobApplications = await this.jobApplicationsService.
        findJobApplicationsByKeywords(userId, companyName, jobTitle);
      return res.status(200).json(jobApplications);
    } catch (error) {
      return res.status(400).json({ message: (error as Error).message });
    }
  }

  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createJobApplication(
    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: JobApplicationDTO
  ) {
    try {
      const { userId } = req.body;

      const createdJobApplication = await this.jobApplicationsService.
        createJobApplication(userId, dto);
      return res.status(200).json(createdJobApplication);
    } catch (error) {
      return res.status(400).json({ message: (error as Error).message });
    }
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async updateJobApplicationStatus(
    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: JobApplicationStatusDTO,
    @Param('id') id: string
  ) {
    try {
      const { userId } = req.body;

      const updatedJobApplication = await this.jobApplicationsService.
        updateJobApplicationStatus(userId, id, dto.status);
      if (!updatedJobApplication) {
        throw new Error(`Job application with ID ${id} was not found`);
      }
      return res.status(200).json(updatedJobApplication);
    } catch (error) {
      return res.status(400).json({ message: (error as Error).message });
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteJobApplication(@Req() req: Request, @Res() res: Response, @Param('id') id: string) {
    try {
      const { userId } = req.body;

      const deletedJobApplication = await this.jobApplicationsService.deleteJobApplication(userId, id);
      if (!deletedJobApplication) {
        throw new Error(`Job application with ID ${id} was not found`);
      }
      return res.status(200).json({ message: `Successfully deleted job application with ID ${id}` });
    } catch (error) {
      return res.status(400).json({ message: (error as Error).message });
    }
  }

}
