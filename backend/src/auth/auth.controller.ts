import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { UserDTO } from '../dtos/user.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @ApiOperation({ summary: 'Sign Up' })
  @Post('/signup') 
  @HttpCode(HttpStatus.OK)
  async signUp(@Res() res: Response, @Body() dto: UserDTO) {
    try {
      const result = await this.authService.signUp(dto);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  @ApiOperation({ summary: 'Log In' })
  @Post('/login')
  async login(@Res() res: Response, @Body() dto: UserDTO) {
    try {
      const result = await this.authService.logIn(dto);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

}
