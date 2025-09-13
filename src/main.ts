import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import * as cryptoModule from 'crypto';

if (typeof global.crypto === 'undefined') {
  (global as any).crypto = cryptoModule;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: (errors) => {
      const formatted = errors.map(err => ({
        field: err.property,
        errors: Object.values(err.constraints || {}),
      }))

      return new BadRequestException(formatted);
    }
  }));

  const config = new DocumentBuilder()
    .setTitle('OlaCick Challenge API')
    .setDescription('API con Nest, Sequelize, Redis')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
