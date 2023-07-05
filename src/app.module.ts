import { TelegrafModule } from 'nestjs-telegraf';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Answer } from './modules/telegram/entities/answer.entity';
import { CreatorQuestion } from './modules/telegram/entities/question-creator.entity';
import { Question } from './modules/telegram/entities/question.entity';
import { User } from './modules/telegram/entities/user.entity';
import { sessionMiddleware } from './modules/telegram/middlewares/session.middleware';
import { TelegramModule } from './modules/telegram/telegram.module';

export const entities = [User, Answer, Question, CreatorQuestion];

@Module({
  imports: [
    TelegramModule,
    ConfigModule.forRoot(),
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        token: configService.get<string>('TOKEN'),
        middlewares: [sessionMiddleware],
      }),
    }),
    //forRootAsync данные из конфиг сервиса
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        ssl: true,
        entities: [...entities],
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
