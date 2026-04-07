import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // If a property is not in the DTO, it will be stripped from the request
    forbidNonWhitelisted: true, // If a property is not in the DTO, an error will be thrown
    transform: true, // If the incoming request has a property that is a string but the DTO expects a number, it will be transformed to a number
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
