import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreatorQuestion } from '../entities/question-creator.entity';

@Injectable()
export class CreatorQuestionService {
  constructor(
    @InjectRepository(CreatorQuestion)
    private readonly creatorQuestionRepository: Repository<CreatorQuestion>,
  ) {}

  async getByTelegramId(telegramId: string) {
    return await this.creatorQuestionRepository.findOneBy({
      telegramId: telegramId,
    });
  }
  async create(creatorQuestion: CreatorQuestion) {
    await this.creatorQuestionRepository.create(creatorQuestion);
    return await this.creatorQuestionRepository.save(creatorQuestion);
  }
  async update(creatorQuestion: CreatorQuestion) {
    return await this.creatorQuestionRepository.save(creatorQuestion);
  }

  async deleteByTelegramId(telegramId: string) {
    return await this.creatorQuestionRepository.delete({
      telegramId: telegramId,
    });
  }
}
