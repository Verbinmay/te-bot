import { log } from 'console';
import { CreateAnswerDto } from 'src/dto/answer/create-answer-dto';
import { Answer } from 'src/entities/answer.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserService } from './user.service';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
    private readonly userService: UserService,
  ) {}
  //TODO check that in db
  async create(a: CreateAnswerDto) {
    const user: User | null = await this.userService.getById(a.userIdFromDb);

    if (!user) return new Error('PROBLEM WITH USER IN DB');
    const answer = new Answer();
    answer.user = user;
    answer.questionId = a.questionId;
    answer.answerStatus = a.answerStatus;
    if (a.answerStatus === 'Incorrect') {
      answer.correctAnswer = a.correctAnswer;
      answer.wrongAnswer = a.wrongAnswer;
    }

    await this.answerRepository.create(answer);
    return await this.answerRepository.save(answer);
  }
  // async getAll() {
  //   return this.taskRepository.find();
  // }
  // async getAllWithPagination(num: number) {
  //   return this.taskRepository.find({
  //     where: {
  //       isPublished: true,
  //     },
  //     order: { createdAt: 'ASC' },
  //     skip: (num - 1) * 20,
  //     take: 20,
  //   });
  // }
  // async getCount() {
  //   return this.taskRepository.count();
  // }

  // async getById(id: number) {
  //   return this.taskRepository.findOneBy({ id: id });
  // }
  // async doneTask(id: number) {
  //   const task: TaskEntity = await this.taskRepository.findOneBy({ id: id });

  //   if (!task) return null;
  //   task.isComplied = !task.isComplied;

  //   await this.taskRepository.save(task);
  //   return this.getAll();
  // }
  // async editTask(id: number, name: string) {
  //   const task: TaskEntity | null = await this.taskRepository.findOneBy({
  //     id: id,
  //   });

  //   if (!task) return null;

  //   task.name = name;

  //   await this.taskRepository.save(task);
  //   return this.getAll();
  // }
  // async create(task: TaskEntity) {
  //   await this.taskRepository.create(task);
  //   await this.taskRepository.save(task);
  //   return this.getAll();
  // }
  // async deleteTask(id: number) {
  //   const deletedInfo = await this.taskRepository.delete({ id: id });

  //   if (deletedInfo.affected === 0) return false;

  //   return this.getAll();
  // }
}
