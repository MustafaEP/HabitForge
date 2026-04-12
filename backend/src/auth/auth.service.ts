import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { AuthResponse } from './types/auth-response.type';
import { JwtSignOptions } from '@nestjs/jwt';
import { StringValue } from 'ms';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private configService: ConfigService,
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
    async login(dto: LoginDto): Promise<AuthResponse> {
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

        const tokens = await this.generateTokens({ sub: user.id });

        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        };
    }

    private async generateTokens(payload: { sub: string }) : Promise<{
        accessToken: string,
        refreshToken: string,
    }> {
        const accessOptions: JwtSignOptions = {
        expiresIn: this.configService.get<StringValue>('jwtAccess.expiresIn'),
    };

    const refreshOptions: JwtSignOptions = {
        secret: this.configService.get<string>('jwtRefresh.secret'),
        expiresIn: this.configService.get<StringValue>('jwtRefresh.expiresIn'),
    };

    const accessToken = await this.jwtService.signAsync(payload, accessOptions);
    const refreshToken = await this.jwtService.signAsync(payload, refreshOptions);

    return { accessToken, refreshToken };
    }
    
    async refreshTokens(
        refreshToken: string,
    ) : Promise<{ accessToken: string }> {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>('jwtRefresh.secret'),
            });

            if(!payload || !payload.sub) {
                throw new UnauthorizedException('Invalid refresh token');
            }

            const AccessPayload = { sub: payload.sub };
            const accessToken = await this.jwtService.signAsync(AccessPayload);
            return { accessToken };
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new UnauthorizedException('Invalid refresh token');
        }           
    }

}
