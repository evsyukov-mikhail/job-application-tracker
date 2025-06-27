import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { ReminderDTO } from '../dtos/reminder.dto';
import { RemindersService } from './reminders.service';
import { CacheService } from '../cache/cache.service';

@Controller('reminders')
export class RemindersController {
  constructor(
    private remindersService: RemindersService,
    private cache: CacheService,
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  async findAllReminders(
    @Req() req: Request & { userId: string },
    @Res() res: Response,
  ) {
    try {
      const cached = await this.cache.redisStore?.hget(req.userId, 'all');
      if (cached) {
        return res.status(200).json(JSON.parse(cached as string));
      }

      const reminders = await this.remindersService.findAllReminders(req.userId);

      await this.cache.redisStore?.hset(req.userId, {
        'all': JSON.stringify(reminders)
      });

      return res.status(200).json(reminders);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  @UseGuards(AuthGuard)
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
