import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // DTO'larda tanımlanmayan alanları otomatik olarak temizler
    forbidNonWhitelisted: true, // Tanımlanmayan alanlar varsa hata fırlatır
    transform: true, // Gelen verileri DTO sınıflarına dönüştürür
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
