import { HabitFrequency } from "@prisma/client/edge";
import { IsString, IsEnum, MinLength, IsBoolean, IsOptional } from 'class-validator'
import { ApiProperty, PartialType } from "@nestjs/swagger";

// https://docs.nestjs.com/openapi/mapped-types#partial

export class CreateHabitDto {
    @ApiProperty({ example: "Drink Water", description: "The name of the habit" })
    @IsString()
    @MinLength(1)
    name: string;
    
    @ApiProperty({ example: true, description: "The status of the habit" })
    @IsBoolean()
    @IsOptional()
    status: boolean;

    @ApiProperty({ example: "daily", description: "The frequency of the habit" })
    @IsEnum(HabitFrequency)
    frequency: HabitFrequency;
}

// PartialType allows us to create an Update DTO that has all the same fields as Create DTO but all of them are optional
export class UpdateHabitDto extends PartialType(CreateHabitDto) {}


export class HabitResponseDto {
    readonly id: string;
    readonly name: string;
    readonly status: boolean;
    readonly frequency: HabitFrequency;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}