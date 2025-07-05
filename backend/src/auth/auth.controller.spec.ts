import * as dotenv from 'dotenv';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Test } from '@nestjs/testing';
import { CryptoModule } from '../crypto/crypto.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthResult } from 'src/interfaces/auth-result.interface';
import { Request, Response } from 'express';
dotenv.config();

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockRequest = {
    query: {},
    userId: '',
  } as unknown as Request & { userId: string };

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(x => x),
  } as unknown as Response;

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

  it('Sign up', async () => {
    const mockResult = {
      username: 'John Doe',
      email: 'johndoe@gmail.com',
      token: 'aaa.bbb.ccc',
    } as AuthResult;
    jest.spyOn(service, 'signUp').mockResolvedValue(mockResult);

    const mockDTO = {
      username: 'John Doe',
      email: 'johndoe@gmail.com',
      password: 'johndoe12345',
    };
    const result = await controller.signUp(mockResponse, mockDTO);
    expect(result).toBe(mockResult);
  })

  it('Log in', async () => {
    const mockResult = {
      username: 'John Doe',
      email: 'johndoe@gmail.com',
      token: 'aaa.bbb.ccc',
    } as AuthResult;
    jest.spyOn(service, 'logIn').mockResolvedValue(mockResult);

    const mockDTO = {
      username: 'John Doe',
      email: 'johndoe@gmail.com',
      password: 'johndoe12345',
    };
    const result = await controller.login(mockResponse, mockDTO);
    expect(result).toBe(mockResult);
  })
})