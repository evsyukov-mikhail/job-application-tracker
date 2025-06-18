import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { UserDTO } from '../dtos/user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('/signup')
  async signUp(@Res() res: Response, @Body() dto: UserDTO) {
    try {
      const result = await this.authService.signUp(dto);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ message: (error as Error).message });
    }
  }

  @Post('/login')
  async login(@Res() res: Response, @Body() dto: UserDTO) {
    try {
      const result = await this.authService.logIn(dto);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ message: (error as Error).message });
    }
  }

}
