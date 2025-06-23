import { Body, Controller, Delete, Get, HttpCode, HttpStatus, MessageEvent, Param, Post, Put, Query, Req, Res, Sse, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { JobApplicationDTO, Status } from '../dtos/job-application.dto';
import { JobApplicationsService } from './job-applications.service';
import { JobApplicationStatusDTO } from '../dtos/job-application-status.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CacheService } from 'src/cache/cache.service';
import EventEmitter2 from 'eventemitter2';
import { Observable } from 'rxjs';

@Controller('job-applications')
export class JobApplicationsController {

  constructor(
    private readonly cache: CacheService,
    private readonly jobApplicationsService: JobApplicationsService,
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  async findAllJobApplications(
    @Req() req: Request & { userId: string },
    @Res() res: Response,
    @Query('status') status: Status
  ) {
    try {
      const cacheKey = status ? `${req.userId}:${status}` : `${req.userId}:all_job_applications`;
      const cached = await this.cache.get(cacheKey);

      if (cached) {
        return res.status(200).json(JSON.parse(cached as string));
      }

      const jobApplications = status
        ? await this.jobApplicationsService.findJobApplicationsByStatus(req.userId, status)
        : await this.jobApplicationsService.findAllJobApplications(req.userId);

      await this.cache.set(cacheKey, JSON.stringify(jobApplications));

      return res.status(200).json(jobApplications);
    } catch (error) {
      return res.status(400).json({ message: (error as Error).message });
    }
  }

  @UseGuards(AuthGuard)
  @Get('/search')
  async findJobApplicationsByKeywords(
    @Req() req: Request & { userId: string },
    @Res() res: Response,
    @Query('companyName') companyName: string,
    @Query('jobTitle') jobTitle: string
  ) {
    try {
      const cacheKey = `${req.userId}:keywords:${companyName}-${jobTitle}`;
      const cached = await this.cache.get(cacheKey);
      if (cached) {
        return res.status(200).json(JSON.parse(cached as string));
      }

      const jobApplications = await this.jobApplicationsService.
        findJobApplicationsByKeywords(req.userId, companyName, jobTitle);

      await this.cache.set(cacheKey, JSON.stringify(jobApplications));

      return res.status(200).json(jobApplications);
    } catch (error) {
      return res.status(400).json({ message: (error as Error).message });
    }
  }

  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createJobApplication(
    @Req() req: Request & { userId: string },
    @Res() res: Response,
    @Body() dto: JobApplicationDTO
  ) {
    try {
      const createdJobApplication = await this.jobApplicationsService.
        createJobApplication(req.userId, dto);
      return res.status(200).json(createdJobApplication);
    } catch (error) {
      return res.status(400).json({ message: (error as Error).message });
    }
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async updateJobApplicationStatus(
    @Req() req: Request & { userId: string },
    @Res() res: Response,
    @Body() dto: JobApplicationStatusDTO,
    @Param('id') id: string
  ) {
    try {
      const updatedJobApplication = await this.jobApplicationsService.
        updateJobApplicationStatus(req.userId, id, dto.status);

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
  async deleteJobApplication(
    @Req() req: Request & { userId: string },
    @Res() res: Response,
    @Param('id') id: string
  ) {
    try {
      const deletedJobApplication = await this.jobApplicationsService.deleteJobApplication(req.userId, id);
      if (!deletedJobApplication) {
        throw new Error(`Job application with ID ${id} was not found`);
      }
      return res.status(200).json({ message: `Successfully deleted job application with ID ${id}` });
    } catch (error) {
      return res.status(400).json({ message: (error as Error).message });
    }
  }

  @Sse('job-application-updates')
  @UseGuards(AuthGuard)
  jobApplicationUpdates(@Req() req: Request & { userId: string }): Observable<MessageEvent> {
    return this.jobApplicationsService.getJobApplicationUpdates(String(req.userId));
  }

}
