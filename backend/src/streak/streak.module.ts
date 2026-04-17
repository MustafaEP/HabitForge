import { Module } from '@nestjs/common';
import { StreakService } from './streak.service';

@Module({
  providers: [StreakService]
})
export class StreakModule {}
