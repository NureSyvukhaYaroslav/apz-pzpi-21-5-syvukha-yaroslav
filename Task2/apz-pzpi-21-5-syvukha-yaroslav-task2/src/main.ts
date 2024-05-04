import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { config } from 'dotenv';

import { AppModule } from './app.module';

import 'dotenv/config';
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

  if (process.env.NODE_ENV === 'development') {
    app.enableCors({
      origin: true,
      credentials: true,
    });

    const config = new DocumentBuilder()
      .setTitle('DocMe API')
      .setBasePath('api')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);
  }

  await app.listen(3000);
}

bootstrap();
