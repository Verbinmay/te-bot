import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { TaskEntity } from './task.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  async getAll() {
    return this.taskRepository.find();
  }

  async getById(id: number) {
    return this.taskRepository.findOneBy({ id: id });
  }
  async doneTask(id: number) {
    const task: TaskEntity = await this.taskRepository.findOneBy({ id: id });

    if (!task) return null;
    task.isComplied = !task.isComplied;

    await this.taskRepository.save(task);
    return this.getAll();
  }
  async editTask(id: number, name: string) {
    const task: TaskEntity | null = await this.taskRepository.findOneBy({
      id: id,
    });

    if (!task) return null;

    task.name = name;

    await this.taskRepository.save(task);
    return this.getAll();
  }
  async create(task: TaskEntity) {
    await this.taskRepository.create(task);
    await this.taskRepository.save(task);
    return this.getAll();
  }
  async deleteTask(id: number) {
    const deletedInfo = await this.taskRepository.delete({ id: id });

    if (deletedInfo.affected === 0) return false;

    return this.getAll();
  }
}
