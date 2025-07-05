import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class ReminderDTO {
  @ApiProperty({ description: 'Reminder title', example: 'Meet up at 10:30' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Reminder date', example: 'Sat, 05 Jul 2025 16:29:43 GMT' })
  @Type(() => Date)
  @IsDate()
  date: Date;
}