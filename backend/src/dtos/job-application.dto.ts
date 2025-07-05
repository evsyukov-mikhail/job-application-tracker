import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsEnum, IsNotEmpty, IsString } from "class-validator";

export enum Status {
  APPLIED = 'Applied',
  INTERVIEWING = 'Interviewing',
  OFFER = 'Offer',
  REJECTED = 'Rejected',
}

export class JobApplicationDTO {
  @ApiProperty({ description: 'Job application company name', example: 'Google' })
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty({ description: 'Job application job title', example: 'Software Engineer' })
  @IsString()
  @IsNotEmpty()
  jobTitle: string;

  @ApiProperty({ description: 'Job application application date', example: 'Sat, 05 Jul 2025 16:29:43 GMT' })
  @Type(() => Date)
  @IsDate()
  applicationDate: Date;

  @ApiProperty({ description: 'Job application status', enum: Status, example: 'Applied' })
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;

  @ApiProperty({ description: 'Job application notes', example: 'Some additional notes' })
  @IsString()
  @IsNotEmpty()
  notes: string;
}