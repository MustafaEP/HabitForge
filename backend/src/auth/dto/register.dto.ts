import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/;
const PASSWORD_MESSAGE = 'Password must be 6-20 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).';

export class RegisterDto {
    @IsEmail({}, { message: 'Pleae enter a valid email address'})
    email: string;

    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @MaxLength(20, { message: 'Password must be at most 20 characters long' })
    @Matches(PASSWORD_REGEX, { message: PASSWORD_MESSAGE })
    password: string;

    @IsString()
    @MaxLength(50, { message: 'Name must be at most 50 characters long' })
    name: string;
}