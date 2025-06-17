import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class UserDTO {
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(12)
  @IsNotEmpty()
  password: string;
}