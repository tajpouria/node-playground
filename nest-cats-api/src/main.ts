import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const { PORT =  '3000' } = process.env;

  const app = await NestFactory.create(AppModule);

  app.enableCors();

  await app.listen(parseInt(PORT));
}
bootstrap();
