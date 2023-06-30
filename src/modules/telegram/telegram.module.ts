import { entities } from 'src/app.module';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { TelegramUpdate } from './telegram.update';

/**сцены */
const scenes = [];

/** сервисы */
const services = [TelegramUpdate];

@Module({
  imports: [
    TypeOrmModule.forFeature([...entities]),
    /**
    Экспортирует HttpModule класс HttpService, который предоставляет методы на основе Axios для выполнения HTTP-запросов. Библиотека также преобразует полученные ответы HTTP в файлы Observables
     * 
     *   findAll(): Observable<AxiosResponse<Cat[]>> {
    return this.httpService.get('http://localhost:3000/cats');
  } */
    HttpModule,
  ],
  providers: [...scenes, ...services],
})
export class TelegramModule {}
