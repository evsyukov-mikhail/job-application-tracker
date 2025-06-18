import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { Reflector } from '@nestjs/core';
import { CryptoModule } from '../crypto/crypto.module';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { DatabaseModule } from '../database/database.module';
import * as dotenv from 'dotenv';
import { Model } from 'mongoose';
import { User } from 'src/interfaces/user.interface';

dotenv.config();

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CryptoModule, DatabaseModule],
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: 'USER_MODEL',
          useValue: Model<User>,
        },
        JwtService,
      ]
    })
      .overrideGuard(AuthGuard)
      .useValue(JwtService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('Controller should be defined', () => {
    expect(controller).toBeDefined();
  });
});
