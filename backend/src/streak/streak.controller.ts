import { Controller, Param } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { Currentuser } from 'src/auth/decorators/current-user.decorator';
import { StreakService } from './streak.service';

@Controller('habits')
export class StreakController {
    constructor(
        private streakService: StreakService,
    ) {}

    @Get(":habitId/stats")
    async stats(
        @Currentuser() user: { id: string },
        @Param("habitId") habitId: string
    ) {
        const result = await this.streakService.getHabitStats(user.id, habitId);
        return result;
    }
}
