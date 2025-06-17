import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { User } from 'src/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  signIn() {
    
  }
}
