import { createServer } from 'http';
import { getBotToken } from 'nestjs-telegraf';

import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    abortOnError: false,
  });
  const bot = app.get(getBotToken());
  const configService = app.get(ConfigService);
  app.use(bot.webhookCallback('/telegram'));
  await bot.telegram.sendMessage(
    424027533,
    `hello from ${configService.get('DOMAIN')}`,
  );

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
