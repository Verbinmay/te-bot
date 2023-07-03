import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Answer } from '../entities/answer.entity';
import { CreatorQuestion } from '../entities/question-creator.entity';
import { Question } from '../entities/question.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async createByCreator(creatorQ: CreatorQuestion) {
    const question = new Question();
    question.body = creatorQ.body;
    question.correctAnswer = creatorQ.correctAnswer;
    question.answer_1 = creatorQ.answer_1;
    question.answer_2 = creatorQ.answer_2;
    question.answer_3 = creatorQ.answer_3;
    question.isPublished = true;

    await this.questionRepository.create(question);
    return this.questionRepository.save(question);
  }
  async deleteById(id: number) {
    const deletedInfo = await this.questionRepository.delete({ id: id });

    if (deletedInfo.affected === 0) return false;

    return true;
  }
  async getById(id: number) {
    return this.questionRepository.findOneBy({ id: id });
  }
  async update(question: Question) {
    return this.questionRepository.save(question);
  }
  async create(question: Question) {
    this.questionRepository.create(question);
    return this.questionRepository.save(question);
  }
  async getCount() {
    return this.questionRepository.count();
  }
  async getAllWithPagination(num: number) {
    return this.questionRepository.find({
      where: {
        isPublished: true,
      },
      order: { createdAt: 'ASC' },
      skip: num * 20,
      take: 20,
    });
  }
  //   async getAll() {
  //     return this.taskRepository.find();
  //   }

  //   async getById(id: number) {
  //     return this.taskRepository.findOneBy({ id: id });
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
