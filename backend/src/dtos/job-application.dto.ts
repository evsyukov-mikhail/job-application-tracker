import { Type } from "class-transformer";
import { IsDate, IsEnum, IsNotEmpty, IsString } from "class-validator";

export enum Status {
  APPLIED = 'Applied',
  INTERVIEWING = 'Interviewing',
  OFFER = 'Offer',
  REJECTED = 'Rejected',
}

export class JobApplicationDTO {

  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsString()
  @IsNotEmpty()
  jobTitle: string;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  applicationDate: Date;

  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;

  @IsString()
  @IsNotEmpty()
  notes: string;
}