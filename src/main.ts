import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import 'reflect-metadata';
import { AppModule } from './app.module';
import { WebsocketAdapter } from './gateway/gateway.adapter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const adapter = new WebsocketAdapter(app);

  app.useWebSocketAdapter(adapter);

  // app.useWebSocketAdapter(new IoAdapter(app));

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.set('trust proxy', 'loopback');

  const PORT = process.env.PORT;

  await app.listen(PORT, () => {
    console.log(`--> Server is running on port: ${PORT}`);
  });
}

bootstrap();
