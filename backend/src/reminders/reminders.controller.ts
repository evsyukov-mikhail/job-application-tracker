import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { ReminderDTO } from '../dtos/reminder.dto';
import { RemindersService } from './reminders.service';
import { CacheService } from '../cache/cache.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('reminders')
export class RemindersController {
  constructor(
    private remindersService: RemindersService,
    private cache: CacheService,
  ) {}

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Find all reminders' })
  @Get()
  async findAllReminders(
    @Req() req: Request & { userId: string },
    @Res() res: Response,
  ) {
    try {
      const cached = await this.cache.redisStore?.hget(req.userId, 'all_reminders');
      if (cached) {
        return res.status(200).json(JSON.parse(cached as string));
      }

      const reminders = await this.remindersService.findAllReminders(req.userId);

      await this.cache.redisStore?.hset(req.userId, { 'all_reminders': JSON.stringify(reminders) });
      await this.cache.redisStore?.expire(req.userId, 60 * 60);

      return res.status(200).json(reminders);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create reminder' })
  @Post()
  async createReminder(
    @Req() req: Request & { userId: string },
    @Res() res: Response,
    @Body() dto: ReminderDTO,
  ) {
    try {
      const createdReminder = await this.remindersService.createReminder(req.userId, dto);
      return res.status(200).json(createdReminder);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

}
