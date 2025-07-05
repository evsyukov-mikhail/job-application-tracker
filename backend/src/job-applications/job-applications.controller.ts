import { Body, Controller, Delete, Get, HttpCode, HttpStatus, MessageEvent, Param, Post, Put, Query, Req, Res, Sse, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { JobApplicationDTO, Status } from '../dtos/job-application.dto';
import { JobApplicationsService } from './job-applications.service';
import { JobApplicationStatusDTO } from '../dtos/job-application-status.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CacheService } from '../cache/cache.service';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('job-applications')
@Controller('job-applications')
export class JobApplicationsController {

  constructor(
    private readonly cache: CacheService,
    private readonly jobApplicationsService: JobApplicationsService,
  ) {}

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Find all job applications' })
  @ApiQuery({ name: 'status', required: false, enum: Status, description: 'Filter by status' })
  @ApiQuery({ name: 'companyName', required: false, type: String, description: 'Filter by company name' })
  @ApiQuery({ name: 'jobTitle', required: false, type: String, description: 'Filter by job title' })
  @Get()
  async findJobApplications(
    @Req() req: Request & { userId: string },
    @Res() res: Response,
    @Query('status') status: Status,
    @Query('companyName') companyName: string,
    @Query('jobTitle') jobTitle: string,
  ) {
    try {
      let cacheKey = '';

      if (status) cacheKey += status
      if (companyName) cacheKey += `:${companyName}`
      if (jobTitle) cacheKey += `:${jobTitle}`

      if (!status && !companyName && !jobTitle) cacheKey += 'all_job_applications';

      const cached = await this.cache.redisStore?.hget(req.userId, cacheKey);
      if (cached) {
        return res.status(200).json(JSON.parse(cached as string));
      }

      const jobApplications = await this.jobApplicationsService.findJobApplications(req.userId, status, companyName, jobTitle);

      await this.cache.redisStore?.hset(req.userId, { [cacheKey]: JSON.stringify(jobApplications) });
      await this.cache.redisStore?.expire(req.userId, 60 * 60);

      return res.status(200).json(jobApplications);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a new job application' })
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
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update job application status' })
  @ApiParam({ name: 'Job application ID', required: false, type: String, description: 'Job application ID' })
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
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete job application' })
  @ApiParam({ name: 'Job application ID', required: false, type: String, description: 'Job application ID' })
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
      return res.status(400).json({ error: (error as Error).message });
    }
  }

}
