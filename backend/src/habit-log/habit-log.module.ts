import { Module } from '@nestjs/common';
import { HabitLogService } from './habit-log.service';
import { HabitLogController } from './habit-log.controller';
import { HabitModule } from '../habit/habit.module';

@Module({
  imports: [HabitModule],
  providers: [HabitLogService],
  controllers: [HabitLogController],
  exports: [HabitLogService]
})
export class HabitLogModule {}
