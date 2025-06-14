import * as mongoose from 'mongoose';

export const JobApplicationSchema = new mongoose.Schema({
  companyName: String,
  jobTitle: String,
  applicationDate: Date,
  status: {
    type: String,
    enum: ['Applied', 'Interviewing', 'Offer', 'Rejected'],
    default: 'Applied',
  },
  notes: String
});