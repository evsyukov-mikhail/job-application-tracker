import { Document } from "mongoose";

export interface JobApplication extends Document {
  readonly companyName: string;
  readonly jobTitle: string;
  readonly applicationDate: Date;
  readonly status: 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';
  readonly notes: string;
  readonly userId: string;
}