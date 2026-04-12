import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UnauthorizedException} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response, Request } from 'express';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { ConfigService } from '@nestjs/config/dist/config.service';
import ms, { StringValue } from 'ms';


@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private configService: ConfigService,
    ) {}

    @Public()
    @Post('register')
    async register(
        @Body() dto: RegisterDto,
    ) {
        const result = await this.authService.register(dto);
        return result;
    }

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() dto: LoginDto,
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response,
    ) {
        const result = await this.authService.login(dto);

        const maxRefreshTokenAge = ms(this.configService.get<StringValue>('jwtRefresh.expiresIn')!);

        response.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',  // ← lax in development for easier testing, strict in production for better security
            maxAge: maxRefreshTokenAge,
            path: '/',  // All routes can access the refresh token cookie
        });

        return {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken, 
        };
    }

    /**
     * POST /auth/refresh
     * Take new access token using refresh token in cookie
     */
    @Public()
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refresh(
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response,
    ) {
        const refreshToken = request.cookies?.refreshToken;
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token not found');
        }

        const result = await this.authService.refreshTokens(
            refreshToken
        );

        return { accessToken: result.accessToken };
    }
}
