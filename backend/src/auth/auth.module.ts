import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StringValue } from 'ms';
import jwtAccessConfig from '../config/jwt-access.config';
import jwtRefreshConfig from '../config/jwt-refresh.config';

@Module({
  imports: [
    UserModule, 
    ConfigModule.forFeature(jwtAccessConfig),
    ConfigModule.forFeature(jwtRefreshConfig),
    
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('jwtAccess.secret'),
        signOptions: {
          expiresIn: configService.get<StringValue>('jwtAccess.expiresIn'),
        }
      })
    })
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
