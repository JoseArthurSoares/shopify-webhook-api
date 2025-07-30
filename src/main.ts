import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { text } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    bodyParser: false
  });
  app.use('/webhooks', text({ type: '*/*' }));
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
