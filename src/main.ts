import { NestFactory } from '@nestjs/core';
import 'reflect-metadata';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT;

  await app.listen(PORT, () => {
    console.log(`--> Server is running on port: ${PORT}`);
  });
}

bootstrap();
