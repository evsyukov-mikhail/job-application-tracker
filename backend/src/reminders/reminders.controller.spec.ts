import * as dotenv from 'dotenv';
import { RemindersController } from './reminders.controller';
import { RemindersService } from './reminders.service';
import { Test } from '@nestjs/testing';
import { CacheService } from '../cache/cache.service';
import { MailsModule } from '../mails/mails.module';
import { MailsService } from '../mails/mails.service';
import { Reminder } from '../interfaces/reminder.interface';
import { Request, Response } from 'express';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { JwtService } from '@nestjs/jwt';
dotenv.config();

describe('RemindersController', () => {
  let controller: RemindersController;
  let service: RemindersService;

  const mockRequest = {
    query: {},
    userId: '',
  } as unknown as Request & { userId: string };

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(x => x),
  } as unknown as Response;

  beforeAll(async () => {
    const mockRemindersModel = {
      find: jest.fn(),
      findById: jest.fn(),
    };

    const mockUserModel = {
      findOne: jest.fn(),
    };

    const mockKeyv = {
      opts: { store: {
        hget: jest.fn(),
        hset: jest.fn(),
        expire: jest.fn(),
      }}
    };

    const module = await Test.createTestingModule({
      controllers: [RemindersController],
      providers: [
        RemindersService,
        CacheService,
        MailsService,
        SchedulerRegistry,
        JwtService,
        {
          provide: 'REMINDER_MODEL',
          useValue: mockRemindersModel,
        },
        {
          provide: 'USER_MODEL',
          useValue: mockUserModel,
        },
        {
          provide: 'CACHE_INSTANCE',
          useValue: mockKeyv,
        },
      ]
    }).compile();

    controller = module.get(RemindersController);
    service = module.get(RemindersService);
  });

  it('RemindersController defined', () => expect(controller).toBeDefined());
  it('RemindersService defined', () => expect(service).toBeDefined());

  it('Find all reminders', async () => {
    const mockResult = [{
      title: 'Reminder',
      date: 'date',
      userId: '1'
    }] as Reminder[];
    jest.spyOn(service, 'findAllReminders').mockResolvedValue(mockResult);

    const result = await controller.findAllReminders(mockRequest, mockResponse);
    expect(result).toBe(mockResult);
  });

  it('Create reminder', async () => {
    const mockResult = {
      title: 'Reminder',
      date: 'date',
      userId: '1'
    } as Reminder;
    jest.spyOn(service, 'createReminder').mockResolvedValue(mockResult);

    const mockDTO = {
      title: 'Reminder',
      date: new Date(),
      userId: '1',
    };
    const result = await controller.createReminder(mockRequest, mockResponse, mockDTO);
    expect(result).toBe(mockResult);
  })
})