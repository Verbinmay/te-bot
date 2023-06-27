import { ConfigModule, ConfigService } from '@nestjs/config';

ConfigModule.forRoot();

import { TelegrafModule } from 'nestjs-telegraf';
import * as LocalSession from 'telegraf-session-local';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppService } from './app.service';
import { AppUpdate } from './app.update';
import { join } from 'path';
import { TaskEntity } from './task.entity';

const sessions = new LocalSession({ database: 'session_db.json' });

const entities = [TaskEntity];

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
  providers: [AppService, AppUpdate],
})
export class AppModule {}
