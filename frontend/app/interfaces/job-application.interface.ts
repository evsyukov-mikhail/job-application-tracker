export interface JobApplication {
  readonly companyName: string;
  readonly jobTitle: string;
  readonly applicationDate: string;
  readonly status: 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';
  readonly notes: string;
}