import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateHabitDto, HabitResponseDto, UpdateHabitDto } from './dto/habit.dto';

@Injectable()
export class HabitService {
    constructor(
        private prisma: PrismaService,
    ) {}

    // Create a new habit for a user
    async create(userId: string, dto: CreateHabitDto)
    {   
        const habit: HabitResponseDto = await this.prisma.habit.create({
            data: {
                userId: userId,
                name: dto.name,
                status: dto.status,
                frequency: dto.frequency,
            }
        });
        return habit;
    }
    
    // Get all habits for a user
    async findAll(userId: string)
    {
        const habits: HabitResponseDto[] = await this.prisma.habit.findMany({
            where: {
                userId: userId,
            }
        });
        return habits;
    }

    // Get a specific habit by ID for a user
    async findById(userId: string, habitId: string)
    {
        const habit: HabitResponseDto | null = await this.prisma.habit.findFirst({
            where: {
                userId: userId,
                id: habitId,
            }
        });
        if (!habit) {
            throw new NotFoundException("Habit not found");
        }
        return habit;
    }

    // Update a habit for a user
    async update(userId: string, habitId: string, dto: UpdateHabitDto)
    {
        await this.findById(userId, habitId);
        const habit: UpdateHabitDto = await this.prisma.habit.update({
            where: {
                userId: userId,
                id: habitId,
            },
            data: {
                name: dto.name,
                status: dto.status,
                frequency: dto.frequency,
            }
        });
        return habit;
    }

    // Delete a habit for a user
    async delete(userId: string, habitId: string)
    {   
        await this.findById(userId, habitId);
        const habit: HabitResponseDto | null = await this.prisma.habit.delete({
            where: {
                userId: userId,
                id: habitId,
            }
        });
        if (!habit) {
            throw new NotFoundException("Habit not found");
        }
        return habit.id;
    }

}
