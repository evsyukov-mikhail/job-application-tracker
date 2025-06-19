import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { ReminderDTO } from 'src/dtos/reminder.dto';

@Controller('reminders')
export class RemindersController {

  @Get()
  @UseGuards(AuthGuard)
  async findAllReminders(
    @Req() req: Request & { userId: string },
    @Res() res: Response,
  ) {
    try {

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

    } catch (error) {
      return res.status(400).json({ message: (error as Error).message });
    }
  }

}
