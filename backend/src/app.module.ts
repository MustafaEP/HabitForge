import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './config/env.validation';
import jwtRefreshConfig from './config/jwt-refresh.config';
import jwtAccessConfig from './config/jwt-access.config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt.auth-guard';
import { HabitModule } from './habit/habit.module';
import { HabitLogModule } from './habit-log/habit-log.module';
import { StreakController } from './streak/streak.controller';
import { StreakModule } from './streak/streak.module';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      validationSchema: envValidationSchema,
      load: [jwtAccessConfig, jwtRefreshConfig],
      validationOptions: {
        abortEarly: false, // All validation errors will be collected and returned, not just the first one
      },
    }),
    PrismaModule, 
    UserModule, 
    AuthModule, HabitModule, HabitLogModule, StreakModule],
  controllers: [AppController, StreakController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    }
  ],
})
export class AppModule {}
