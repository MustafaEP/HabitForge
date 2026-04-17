
export class HabitLogResponseDto {
    readonly id: string;
    readonly isCompleted: boolean;
    readonly entryDate: Date;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly habitId: string;
}