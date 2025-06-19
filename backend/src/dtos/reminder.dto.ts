import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class ReminderDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @Type(() => Date)
  @IsDate()
  date: Date;
}