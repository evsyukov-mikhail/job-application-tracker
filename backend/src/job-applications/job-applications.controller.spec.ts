import { JobApplicationsController } from "./job-applications.controller"
import { JobApplicationsService } from "./job-applications.service"
import { Test } from "@nestjs/testing";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { JwtService } from "@nestjs/jwt";
import { CacheService } from "../cache/cache.service";
import { Request, Response } from "express";
import { JobApplicationDTO, Status } from "../dtos/job-application.dto";

import * as dotenv from 'dotenv';
import { JobApplication } from "src/interfaces/job-application.interface";
import { Mongoose, Types } from "mongoose";
dotenv.config();

describe('JobApplicationsController', () => {
  let controller: JobApplicationsController;
  let service: JobApplicationsService;

  const requestMock = {
    query: {},
    userId: '',
  } as unknown as Request & { userId: string };

  const responseMock = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(x => x),
  } as unknown as Response;

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

  it('Find all job applications', async () => {
    const mockResult = [{
      companyName: 'Company name',
      jobTitle: 'job title',
      applicationDate: 'application date',
      status: 'Applied',
      notes: 'notes',
      userId: new Types.ObjectId('D3D0A4B374837B02A823E0AB'),
    }] as JobApplication[];
    jest.spyOn(service, 'findJobApplications').mockResolvedValue(mockResult);

    const result = await controller.findJobApplications(requestMock, responseMock, Status.APPLIED, '', '');
    expect(result).toBe(mockResult);
  });

  it('Create job application', async () => {
    const mockResult = {
      companyName: 'Company name',
      jobTitle: 'job title',
      applicationDate: 'application date',
      status: 'Applied',
      notes: 'notes',
    } as JobApplication;
    jest.spyOn(service, 'createJobApplication').mockResolvedValue(mockResult);

    const result = await controller.createJobApplication(requestMock, responseMock, {
      companyName: '',
      jobTitle: 'job title',
      applicationDate: new Date(),
      status: Status.APPLIED,
      notes: 'notes'
    });
    expect(result).toBe(mockResult);
  });

  it('Update job application status', async () => {
    const mockResult = {
      companyName: 'Company name',
      jobTitle: 'job title',
      applicationDate: 'application date',
      status: 'Offer',
      notes: 'notes',
      userId: new Types.ObjectId('D3D0A4B374837B02A823E0AB'),
    } as JobApplication;
    jest.spyOn(service, 'updateJobApplicationStatus').mockResolvedValue(mockResult);

    const result = await controller.updateJobApplicationStatus(requestMock, responseMock, {
      status: Status.OFFER,
    }, 'D3D0A4B374837B02A823E0AB');
    expect(result).toBe(mockResult);
  });

  it('Delete job application', async () => {
    const mockResult = {
      companyName: 'Company name',
      jobTitle: 'job title',
      applicationDate: 'application date',
      status: 'Offer',
      notes: 'notes',
      userId: new Types.ObjectId('D3D0A4B374837B02A823E0AB'),
    } as JobApplication;
    jest.spyOn(service, 'deleteJobApplication').mockResolvedValue(mockResult);

    const result = await controller.deleteJobApplication(requestMock, responseMock, 'D3D0A4B374837B02A823E0AB');
    expect(result).toEqual({
      message: 'Successfully deleted job application with ID D3D0A4B374837B02A823E0AB'
    });
  });
})