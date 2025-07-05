import * as dotenv from 'dotenv';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Test } from '@nestjs/testing';
import { CryptoModule } from 'src/crypto/crypto.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { DatabaseModule } from 'src/database/database.module';
dotenv.config();

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeAll(async () => {
    const mockUserModel = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    const module = await Test.createTestingModule({
      imports: [CryptoModule, JwtModule.register({
        global: true,
        secret: process.env.JWT_SECRET_KEY,
        signOptions: { expiresIn: '1h' },
      })],
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: 'USER_MODEL',
          useValue: mockUserModel,
        },
        JwtService,
      ]
    }).compile();

    controller = module.get(AuthController);
    service = module.get(AuthService);
  });

  it('AuthController defined', () => expect(controller).toBeDefined());
  it('AuthService defined', () => expect(service).toBeDefined());
})