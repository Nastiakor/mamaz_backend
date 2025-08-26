import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(express.json());

  // Enable runtime DTO validation and strip unknown props
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove unknown fields
      forbidNonWhitelisted: true, // reject if unknown fields are sent
      transform: true, // auto-transform payloads to DTO classes
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
