import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { HabitService } from './habit.service';
import { CreateHabitDto, UpdateHabitDto } from './dto/habit.dto';
import { Currentuser } from 'src/auth/decorators/current-user.decorator';

@Controller('habits')
export class HabitController {
    constructor(
        private habitService: HabitService,
    ) {}

    @Post("")
    async create(
        @Body() body: CreateHabitDto,
        @Currentuser() user: { id: string },
    ) {
        const result = await this.habitService.create(user.id, body);
        return result;
    }

    @Get("")
    async getAll(
        @Currentuser() user: { id: string },
    ) {
        const result = await this.habitService.findAll(user.id);
        return result;
    }
    
    @Get(":id")
    async getById(
        @Currentuser() user: { id: string },
        @Param("id") habitId: string,
    ) {
        const result = await this.habitService.findById(user.id, habitId);
        return result;
    }   
    
    @Patch(":id")
    async update(
        @Currentuser() user: { id: string },
        @Param("id") habitId: string,
        @Body() body: UpdateHabitDto,
    ) {
        const result = await this.habitService.update(user.id, habitId, body);
        return result;
    }

    @Delete(":id")
    async delete(
        @Currentuser() user: { id: string },
        @Param("id") habitId: string,
    ) {
        const result = await this.habitService.delete(user.id, habitId);
        return result;
    }
}
