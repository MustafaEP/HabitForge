import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { HabitLogService } from './habit-log.service';
import { Currentuser } from 'src/auth/decorators/current-user.decorator';

@Controller('habits')
export class HabitLogController {
    constructor(
        private habitLogService: HabitLogService,
    ) {}

    @Post(":habitId/logs") 
    async checkIn(
        @Currentuser() user: { id: string },
        @Param("habitId") habitId: string,
    ) {
        const result = await this.habitLogService.checkIn(user.id, habitId);
        return result;
    }

    @Delete(":habitId/logs/today")
    async deleteToday(
        @Currentuser() user: { id: string },
        @Param("habitId") habitId: string,
    ) {
        const result = await this.habitLogService.uncheckIn(user.id, habitId);
        return result;
    }

    @Get(":habitId/logs")
    async getLogs(
        @Currentuser() user: { id: string },
        @Param("habitId") habitId: string,
        @Query("start") start: string,
        @Query("end") end: string
    ){
        const startDate = new Date(start);
        const endDate = new Date(end);
        endDate.setHours(23, 59, 59, 999);

        const result = await this.habitLogService.getLogsByHabit(user.id, habitId, startDate, endDate);
        return result;
    }
}
