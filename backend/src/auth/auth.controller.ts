import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {

  @HttpCode(HttpStatus.OK)
  @Post('/signin')
  async signIn() {
    
  }

  @Post('/login')
  async login() {

  }

}
