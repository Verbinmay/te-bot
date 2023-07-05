import { createServer } from 'http';
import { getBotToken } from 'nestjs-telegraf';

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { abortOnError: false });
  await app.listen(3000);

  const bot = app.get(getBotToken());

  createServer(
    await bot.createWebhook({ domain: 'iterviewer.onrender.com' }),
  ).listen(process.env.PORT || 5001);

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));

  // bot.start((ctx) => {
  //   console.log('Received /start command');
  //   try {
  //     return ctx.reply('Hi');
  //   } catch (e) {
  //     console.error('error in start action:', e);
  //     return ctx.reply('Error occured');
  //   }
  // });
  // exports.handler = async (event) => {
  //   try {
  //     await bot.handleUpdate(JSON.parse(event.body));
  //     return { statusCode: 200, body: '' };
  //   } catch (e) {
  //     console.error('error in handler:', e);
  //     return {
  //       statusCode: 400,
  //       body: 'This endpoint is meant for bot and telegram communication',
  //     };
  //   }
  // };
}
bootstrap();
