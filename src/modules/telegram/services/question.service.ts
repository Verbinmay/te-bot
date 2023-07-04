import { DataSource, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

import { Answer } from '../entities/answer.entity';
import { CreatorQuestion } from '../entities/question-creator.entity';
import { Question } from '../entities/question.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
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
    return await this.questionRepository.save(question);
  }
  async deleteById(id: number) {
    const deletedInfo = await this.questionRepository.delete({ id: id });

    if (deletedInfo.affected === 0) return false;

    return true;
  }
  async getById(id: number) {
    return await this.questionRepository.findOneBy({ id: id });
  }
  async update(question: Question) {
    return await this.questionRepository.save(question);
  }
  async create(question: Question) {
    await this.questionRepository.create(question);
    return await this.questionRepository.save(question);
  }
  async getCount() {
    return await this.questionRepository.count();
  }
  async getTwentyWithPagination(num: number) {
    return await this.questionRepository.find({
      where: {
        isPublished: true,
      },
      order: { createdAt: 'ASC' },
      skip: num * 20,
      take: 20,
    });
  }

  async getFortyWithPagination() {
    return await this.dataSource
      .createQueryBuilder()
      .select('question')
      .from(Question, 'question')
      .orderBy('RANDOM()')
      .limit(40)
      .getMany();
  }
}
