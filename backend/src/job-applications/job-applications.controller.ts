import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { Model } from 'mongoose';
import { JobApplicationDTO } from 'src/dtos/job-application.dto';
import { JobApplication } from 'src/interfaces/job-application.interface';

@Controller('job-applications')
export class JobApplicationsController {

  constructor(
    @Inject('JOB_APPLICATION_MODEL')
    private jobApplicationModel: Model<JobApplication>
  ) {}

  @Get()
  async getJobApplications(@Res() res: Response) {
    return await this.jobApplicationModel.find().exec();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createJobApplication(@Body() dto: JobApplicationDTO) {
    const jobApplication = new this.jobApplicationModel();
    return await jobApplication.save();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteJobApplication(
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    const deletedJobApplication = await this.jobApplicationModel.findByIdAndDelete(id).exec();
    if (!deletedJobApplication) {
      return res.status(404).json({ message: `Job application with ID ${id} was not found` });
    }
    return;
  }

}
