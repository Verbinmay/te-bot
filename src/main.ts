import { getBotToken } from 'nestjs-telegraf';

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { abortOnError: false });
  const bot = app.get(getBotToken());
  app.use(bot.webhookCallback('/telegram'));
  await bot.telegram.sendMessage(424027533, 'hello');
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
