import { log } from 'console';
import { createServer } from 'http';
import { getBotToken } from 'nestjs-telegraf';

import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AllExceptionsFilter } from './filters/exception.filter';
import { LoggingInterceptor } from './interceptors/logger.interceptor';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    abortOnError: false,
  });

  const bot = app.get(getBotToken());
  const configService = app.get(ConfigService);
  const httpAdapterHost = app.get(HttpAdapterHost);

  app.use(bot.webhookCallback('/telegram'));
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

  await bot.telegram.sendMessage(
    424027533,
    `hello from ${configService.get('DOMAIN')}`,
  );
  await app.listen(process.env.PORT || 3000);
}

try {
  bootstrap();
} catch (e) {
  log(e, 'e');
}
