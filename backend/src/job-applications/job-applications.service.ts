import { Inject, Injectable, MessageEvent } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { JobApplicationDTO, Status } from '../dtos/job-application.dto';
import { JobApplication } from '../interfaces/job-application.interface';
import { map, Observable, ReplaySubject } from 'rxjs';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class JobApplicationsService {
  constructor(
    @Inject('JOB_APPLICATION_MODEL')
    private readonly jobApplicationModel: Model<JobApplication>,
  ) {}

  private readonly statusPrecedences = {
    [Status.APPLIED]: 0,
    [Status.INTERVIEWING]: 1,
    [Status.OFFER]: 2,
    [Status.REJECTED]: 3,
  }

  private readonly subjects = new Map<string, ReplaySubject<JobApplication>>();

  findJobApplications(userId: string, status?: string, companyName?: string, jobTitle?: string): Promise<JobApplication[]> {
    const query: any = { userId };

    if (status) {
      query.status = { $regex: new RegExp(status, 'i') };
    }

    if (companyName) {
      query.companyName = { $regex: new RegExp(companyName, 'i') };
    }

    if (jobTitle) {
      query.jobTitle = { $regex: new RegExp(jobTitle, 'i') };
    }

    return this.jobApplicationModel.find(query);
  }

  createJobApplication(userId: string, dto: JobApplicationDTO): Promise<JobApplication> {
    const jobApplication = new this.jobApplicationModel({ ...dto, userId });
    return jobApplication.save();
  }

  async updateJobApplicationStatus(userId: string, id: string, status: Status): Promise<JobApplication | null> {
    const jobApplication = await this.jobApplicationModel.findById(id);
    if (!jobApplication) {
      throw new Error(`Failed to find job application by ID ${id}`);
    }

    const isJobApplicationOfUser = new mongoose.Types.ObjectId(jobApplication.userId).equals(userId);

    if (!isJobApplicationOfUser) {
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

    if (!jobApplication.userId.equals(userId)) {
      throw new Error("User doesn't have the permission to update the status of this product");
    }

    return this.jobApplicationModel.findByIdAndDelete(id);
  }
}
