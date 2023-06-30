import { log } from 'console';
import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreatorQuestion } from '../entities/question-creator.entity';
import { Question } from '../entities/question.entity';

@Injectable()
export class CreatorQuestionService {
  constructor(
    @InjectRepository(CreatorQuestion)
    private readonly creatorQuestionRepository: Repository<CreatorQuestion>,
  ) {}

  async getByTelegramId(telegramId: string) {
    return this.creatorQuestionRepository.findOneBy({ telegramId: telegramId });
  }
  async create(creatorQuestion: CreatorQuestion) {
    await this.creatorQuestionRepository.create(creatorQuestion);
    return await this.creatorQuestionRepository.save(creatorQuestion);
  }
  async update(creatorQuestion: CreatorQuestion) {
    return await this.creatorQuestionRepository.save(creatorQuestion);
  }

  async deleteByTelegramId(telegramId: string) {
    return this.creatorQuestionRepository.delete({ telegramId: telegramId });
  }
  //   async getAllWithPagination(num: number) {
  //     return this.taskRepository.find({
  //       where: {
  //         isPublished: true,
  //       },
  //       order: { createdAt: 'ASC' },
  //       skip: (num - 1) * 20,
  //       take: 20,
  //     });
  //   }
  //   async getCount() {
  //     return this.taskRepository.count();
  //   }

  //   async doneTask(id: number) {
  //     const task: TaskEntity = await this.taskRepository.findOneBy({ id: id });

  //     if (!task) return null;
  //     task.isComplied = !task.isComplied;

  //     await this.taskRepository.save(task);
  //     return this.getAll();
  //   }
  //   async editTask(id: number, name: string) {
  //     const task: TaskEntity | null = await this.taskRepository.findOneBy({
  //       id: id,
  //     });

  //     if (!task) return null;

  //     task.name = name;

  //     await this.taskRepository.save(task);
  //     return this.getAll();
  //   }
  //   async deleteTask(id: number) {
  //     const deletedInfo = await this.taskRepository.delete({ id: id });

  //     if (deletedInfo.affected === 0) return false;

  //     return this.getAll();
  //   }
}
