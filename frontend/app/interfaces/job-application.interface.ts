export interface JobApplication {
  readonly _id: string;
  readonly companyName: string;
  readonly jobTitle: string;
  readonly applicationDate: string;
  readonly status: string;
  readonly notes: string;
}