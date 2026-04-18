import { Injectable } from '@nestjs/common';
import { HabitLogService } from 'src/habit-log/habit-log.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StreakService {
    constructor (
        private prisma: PrismaService,
        private habitLogService: HabitLogService,
    ){}

    async getCurrentStreak(userId: string, habitId: string)
    {
        const habitLogs = await this.prisma.habitLog.findMany({
            where: {
                habitId: habitId
            },
            orderBy: {
                entryDate: 'desc'
            },
            select: {
                entryDate: true
            }
        });

        if(habitLogs.length === 0) return 0;

        let streak: number = 0;
        let dateHolder: Date = new Date();
        dateHolder.setHours(0, 0, 0, 0);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (habitLogs[0].entryDate.getTime() === dateHolder.getTime()) {} 
        else if (habitLogs[0].entryDate.getTime() === yesterday.getTime()) {
            dateHolder = yesterday;
        } else {
            return 0; 
        }

        for(const hLog of habitLogs) {
            if (dateHolder.getTime() === hLog.entryDate.getTime()) {
                dateHolder.setDate(dateHolder.getDate() - 1)
                streak++;
            }
            else {
                break;
            }
        }
        return streak;
    }

    async getLongestStreak(userId: string, habitId: string) 
    {
        const habitLogs = await this.prisma.habitLog.findMany({
            where: {
                habitId: habitId
            },
            orderBy: {
                entryDate: 'asc'
            },
            select: {
                entryDate: true
            }
        });

        if(habitLogs.length === 0) return 0;

        let maxStreak: number = 0;
        let streak: number = 0;
        let dateHolder: Date = habitLogs[0].entryDate;

        const oneDayMs = 24 * 60 * 60 * 1000;

        for(const hLog of habitLogs) {
            const abs = Math.abs(hLog.entryDate.getTime() - dateHolder.getTime());
            if(abs <= oneDayMs) {
                streak++;
            } else {
                maxStreak = Math.max(maxStreak, streak);
                streak = 1;
            }
            dateHolder = hLog.entryDate;
        }      
        return Math.max(maxStreak, streak);
    }

    async getHabitStats(userId: string, habitId: string)
    {
        await this.habitLogService.isHabit(userId, habitId);

        const currentStreak = await this.getCurrentStreak(userId, habitId);
        const longestStreak = await this.getLongestStreak(userId, habitId);

        const totelCompletions: number = await this.prisma.habitLog.count({
            where: {
                habitId: habitId
            }
        });

        const createdDate = await this.prisma.habit.findFirst({
            where: {
                id: habitId
            },
            select: {
                createdAt: true
            }
        });

        let dayCount: number = 0
        const date = createdDate?.createdAt;
        if(date !== undefined)
        {
            const today: Date = new Date();

            date?.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);

            const absMs: number = Math.abs(today.getTime() - date?.getTime());

            const oneDayMs: number = 24 * 60 * 60 * 1000;
            dayCount = Math.floor(absMs / oneDayMs);
        }
        

        const completionRate : number = dayCount === 0 ? 0 : (totelCompletions / dayCount) * 100;

        return {
            currentStreak,
            longestStreak,
            totelCompletions,
            completionRate
        }

    }
}
