import { Type } from "class-transformer";
import { IsDate, IsEnum, IsNotEmpty, IsString } from "class-validator";

enum Status {
  APPLIED,
  INTERVIEWING,
  OFFER,
  REJECTED
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