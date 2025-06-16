import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { JobApplicationDTO, Status } from 'src/dtos/job-application.dto';
import { JobApplication } from 'src/interfaces/job-application.interface';

@Injectable()
export class JobApplicationsService {
  constructor(
    @Inject('JOB_APPLICATION_MODEL')
    private jobApplicationModel: Model<JobApplication>
  ) {}

  private statusPrecedences = {
    [Status.APPLIED]: 0,
    [Status.INTERVIEWING]: 1,
    [Status.OFFER]: 2,
    [Status.REJECTED]: 3,
  }

  findAllJobApplications(): Promise<JobApplication[]> {
    return this.jobApplicationModel.find({});
  }

  createJobApplication(dto: JobApplicationDTO): Promise<JobApplication> {
    const jobApplication = new this.jobApplicationModel(dto);
    return jobApplication.save();
  }

  async updateJobApplicationStatus(id: string, status: Status): Promise<JobApplication | null> {
    const jobApplication = await this.jobApplicationModel.findById(id);
    if (!jobApplication) {
      throw new Error(`Failed to find job application by ID ${id}`);
    }

    if (this.statusPrecedences[status] < this.statusPrecedences[jobApplication.status]) {
      throw new Error(`Failed to update job application status: ${status} has lower precendence than ${jobApplication.status}`);
    }

    return this.jobApplicationModel.findByIdAndUpdate(id, { status }, { new: true });
  }

  deleteJobApplication(id: string): Promise<JobApplication | null> {
    return this.jobApplicationModel.findByIdAndDelete(id);
  }
}
