import { JobApplicationsController } from "./job-applications.controller"
import { JobApplicationsService } from "./job-applications.service"
import { Test } from "@nestjs/testing";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { JwtService } from "@nestjs/jwt";
import { CacheService } from "../cache/cache.service";

import * as dotenv from 'dotenv';
import { KeyvStoreAdapter } from "cacheable";
dotenv.config();

describe('JobApplicationsController', () => {
  let controller: JobApplicationsController;
  let service: JobApplicationsService;

  beforeAll(async () => {
    const mockJobApplicationModel = {
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
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
      imports: [EventEmitterModule.forRoot()],
      controllers: [JobApplicationsController],
      providers: [
        JobApplicationsService,
        {
          provide: 'JOB_APPLICATION_MODEL',
          useValue: mockJobApplicationModel,
        },
        {
          provide: 'USER_MODEL',
          useValue: mockUserModel,
        },
        CacheService,
        {
          provide: 'CACHE_INSTANCE',
          useValue: mockKeyv,
        },
        JwtService,
      ],
    }).compile();

    controller = module.get(JobApplicationsController);
    service = module.get(JobApplicationsService);
  });

  it('Controller is defined', () => expect(controller).toBeDefined());
  it('Service is defined', () => expect(service).toBeDefined());
})