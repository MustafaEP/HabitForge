import { Module } from '@nestjs/common';
import { StreakService } from './streak.service';
import { StreakController } from './streak.controller';
import { HabitLogModule } from 'src/habit-log/habit-log.module';

@Module({
  imports: [HabitLogModule],
  providers: [StreakService],
  controllers: [StreakController],
})
export class StreakModule {}
