import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { JobApplicationDTO, Status } from '../dtos/job-application.dto';
import { JobApplication } from '../interfaces/job-application.interface';

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

  findAllJobApplications(userId: string): Promise<JobApplication[]> {
    return this.jobApplicationModel.find({ userId });
  }

  findJobApplicationsByStatus(userId: string, status: Status): Promise<JobApplication[]> {
    return this.jobApplicationModel.find({ status, userId });
  }

  findJobApplicationsByKeywords(userId: string, companyName: string, jobTitle: string): Promise<JobApplication[]> {
    const query: any = { userId };

    if (companyName) {
      query.companyName = { $regex: new RegExp(companyName, 'i') };
    }

    if (jobTitle) {
      query.jobTitle = { $regex: new RegExp(jobTitle, 'i') };
    }

    return this.jobApplicationModel.find(query);
  }

  createJobApplication(userId: string, dto: JobApplicationDTO): Promise<JobApplication> {
    console.log(dto);

    const jobApplication = new this.jobApplicationModel({
      ...dto,
      userId,
    });
    return jobApplication.save();
  }

  async updateJobApplicationStatus(userId: string, id: string, status: Status): Promise<JobApplication | null> {
    const jobApplication = await this.jobApplicationModel.findOne({ id });
    if (!jobApplication) {
      throw new Error(`Failed to find job application by ID ${id}`);
    }

    if (jobApplication.userId !== userId) {
      throw new Error("User doesn't have the permission to update the status of this product");
    }

    if (this.statusPrecedences[status] < this.statusPrecedences[jobApplication.status]) {
      throw new Error(`Failed to update job application status: ${status} has lower precendence than ${jobApplication.status}`);
    }

    return this.jobApplicationModel.findByIdAndUpdate(id, { status }, { new: true });
  }

  async deleteJobApplication(userId: string, id: string): Promise<JobApplication | null> {
    const jobApplication = await this.jobApplicationModel.findById(id);
    if (!jobApplication) {
      throw new Error(`Failed to find job application by ID ${id}`);
    }

    if (jobApplication.userId !== userId) {
      throw new Error("User doesn't have the permission to update the status of this product");
    }

    return this.jobApplicationModel.findByIdAndDelete(id);
  }
}
