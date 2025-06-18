import { IsEnum, IsNotEmpty } from "class-validator";
import { Status } from "./job-application.dto";

export class JobApplicationStatusDTO {
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;
}