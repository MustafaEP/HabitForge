import { IsEmail, IsString, MaxLength, Min, MinLength } from "class-validator";

export class LoginDto {
    @IsEmail({}, { message: 'Please enter a valid email address' })
    email: string;

    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @MaxLength(20, { message: 'Password must be at most 20 characters long' })
    password: string;
}