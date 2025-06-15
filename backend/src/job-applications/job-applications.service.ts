import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { JobApplicationDTO } from 'src/dtos/job-application.dto';
import { JobApplication } from 'src/interfaces/job-application.interface';

@Injectable()
export class JobApplicationsService {
  constructor(
    @Inject('JOB_APPLICATION_MODEL')
    private jobApplicationModel: Model<JobApplication>
  ) {}

  findAllJobApplications(): Promise<JobApplication[]> {
    return this.jobApplicationModel.find({});
  }

  createJobApplication(dto: JobApplicationDTO): Promise<JobApplication> {
    const jobApplication = new this.jobApplicationModel(dto);
    return jobApplication.save();
  }

  deleteJobApplication(id: string) {
    return this.jobApplicationModel.findByIdAndDelete(id).exec();
  }
}
