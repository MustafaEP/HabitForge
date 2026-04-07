import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
    ) {}

    /**
     * Register a new user
     */
    async register(dto: RegisterDto) {
        // Check if email is already in use
        const existingUser = await this.userService.findByEmail(dto.email);
        if (existingUser) {
            throw new ConflictException('Email is already in use');
        }

        // Hash the password before saving the user
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(dto.password, salt);

        console.log('Password hash generated:', passwordHash);

        // Create the user
        const user = await this.userService.create({
            email: dto.email,
            name: dto.name,
            passwordHash: passwordHash,
        });
        return {
            id: user.id,
            email: user.email,
            name: user.name,   
        };
    }

    /**
     * Login a user
     */
    async login(dto: LoginDto) {
        // Find the user by email
        const user = await this.userService.findByEmail(dto.email);
        if(!user || !user.passwordHash) {
            throw new UnauthorizedException('Invalid email or password');
        }

        // Compare the provided password with the stored hash
        const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        return {
            id: user.id,
            email: user.email,
            name: user.name,
        };
    }
}
