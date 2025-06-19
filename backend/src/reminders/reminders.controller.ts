import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { ReminderDTO } from 'src/dtos/reminder.dto';
import { RemindersService } from './reminders.service';

@Controller('reminders')
export class RemindersController {
  constructor(
    private remindersService: RemindersService,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async findAllReminders(
    @Req() req: Request & { userId: string },
    @Res() res: Response,
  ) {
    try {
      const reminders = await this.remindersService.findAllReminders(req.userId);
      return res.status(200).json(reminders);
    } catch (error) {
      return res.status(400).json({ message: (error as Error).message });
    }
  }

  @Post()
  @UseGuards(AuthGuard)
  async createReminder(
    @Req() req: Request & { userId: string },
    @Res() res: Response,
    @Body() dto: ReminderDTO,
  ) {
    try {
      const createdReminder = await this.remindersService.createReminder(req.userId, dto);
      return res.status(200).json(createdReminder);
    } catch (error) {
      return res.status(400).json({ message: (error as Error).message });
    }
  }

}
