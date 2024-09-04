import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const config = new DocumentBuilder()
    .setTitle('GPT Portal')
    .setDescription('The API description for GPT chat app')
    .setVersion('1.0')
    .addTag('gpt')
    .addTag('chat')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document, {
    jsonDocumentUrl: 'swagger/json',
  })
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  await app.listen(3000);
}
bootstrap();
