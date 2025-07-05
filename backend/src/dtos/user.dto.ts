import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class UserDTO {
  @ApiProperty({ description: 'Username', example: 'John Doe' })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'Email', example: 'johndoe@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Password', example: 'johndoe12345' })
  @IsString()
  @MinLength(12)
  @IsNotEmpty()
  password: string;
}