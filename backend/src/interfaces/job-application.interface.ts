import mongoose, { Document } from "mongoose";

export interface JobApplication extends Document {
  readonly companyName: string;
  readonly jobTitle: string;
  readonly applicationDate: string;
  readonly status: 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';
  readonly notes: string;
  readonly userId: mongoose.Types.ObjectId;
}