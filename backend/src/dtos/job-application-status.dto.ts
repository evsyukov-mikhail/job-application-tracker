import { IsEnum, IsNotEmpty } from "class-validator";
import { Status } from "./job-application.dto";
import { ApiProperty } from "@nestjs/swagger";

export class JobApplicationStatusDTO {
  @ApiProperty({ description: 'Job application status', enum: Status, example: 'Applied' })
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;
}