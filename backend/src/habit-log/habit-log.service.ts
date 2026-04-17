import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { HabitService } from 'src/habit/habit.service';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class HabitLogService {
    constructor(
        private prisma: PrismaService,
        private habitService: HabitService,
    ) {}

    async checkIn(userId: string, habitId: string) {
        const today: Date = new Date();
        today.setHours(0, 0, 0, 0);

        if(await this.isCheckedInToday(habitId, today)) {
            throw new ConflictException("You already entered a habit log today!");
        }

        await this.isHabit(userId, habitId);


        const habitLog = await this.prisma.habitLog.create({
            data: {
                isCompleted: true,
                entryDate: today,
                habitId: habitId
            }
        });
        return habitLog;
    }

    async uncheckIn(userId: string, habitId: string) {
        await this.isHabit(userId, habitId);

        const today: Date = new Date();
        today.setHours(0, 0, 0, 0);
        
        if(!(await this.isCheckedInToday(habitId, today))) {
            throw new ConflictException("No check-in found for today");
        } 
        const log = await this.prisma.habitLog.deleteMany({
            where: {
                habitId: habitId,
                entryDate: today
            }
        });
        return log;
    }

    async getLogsByHabit(userId: string, habitId: string, startDate?: Date, endDate?: Date) {
        await this.isHabit(userId, habitId);
        const logs = await this.prisma.habitLog.findMany({
            where: {
                entryDate: {
                    gte: startDate,
                    lte: endDate
                },
                habitId: habitId
            }
        });
        return logs;
    }

    async isCheckedInToday(habitId: string, today: Date): Promise<boolean> {
        const count = await this.prisma.habitLog.count({
            where: {
                habitId: habitId,
                entryDate: today
            }
        });
        return count > 0;
    }

    async isHabit(userId: string, habitId: string) {
        const habit: number = await this.prisma.habit.count({
            where: {
                id: habitId,
                userId: userId
            }
        });
        if(habit === 0) {
            throw new NotFoundException("You don't have a habit");
        }
    }
}
