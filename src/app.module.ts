import { ConfigModule, ConfigService } from '@nestjs/config';

ConfigModule.forRoot();

import { TelegrafModule } from 'nestjs-telegraf';
import * as LocalSession from 'telegraf-session-local';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppUpdate } from './app.update';
import { Answer } from './entities/answer.entity';
import { Question } from './entities/question.entity';
import { User } from './entities/user.entity';
import { UserService } from './services/user.service';

const sessions = new LocalSession({ database: 'session_db.json' });

const entities = [User, Answer, Question];

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        middlewares: [sessions.middleware()],
        token: configService.get('TOKEN'),
      }),
      inject: [ConfigService],
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
        // ssl: true,
        entities: [...entities],
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([...entities]),
  ],
  controllers: [],
  providers: [AppUpdate, UserService],
})
export class AppModule {}
