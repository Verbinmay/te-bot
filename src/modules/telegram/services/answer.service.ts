import { Answer } from 'src/modules/telegram/entities/answer.entity';
import { In, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ViewInterviewAnswerDto } from '../dto/answer/view-answer-interview-dto';
import { ViewWrongAnswerDto } from '../dto/answer/view-wrong-answer-dto';
import { Question } from '../entities/question.entity';
import { UserService } from './user.service';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>, // private readonly userService: UserService,
  ) {}

  async findWrongQuestions(telegramId: string) {
    const questions: Array<Question> = await this.questionRepository.find({
      relations: {
        answers: { user: true },
      },
      where: {
        answers: {
          answerStatus: 'Incorrect',
          user: { telegramId: telegramId },
        },
      },
    });

    const viewAnswers: Array<ViewWrongAnswerDto> = questions.map((q) => {
      return {
        'Id вопроса': q.id,
        Вопрос: q.body,
        'Правильный ответ': q.correctAnswer,
        'Твой ответ': q.answers.find((a) => a.user.telegramId === telegramId)
          .body,
        'Процент ответивших неправильно':
          (q.answers.filter((a) => a.answerStatus === 'Incorrect').length /
            q.answers.length) *
          100,
      };
    });
    return viewAnswers;
  }

  async findInterviewQuestions(array: Array<Question>, telegramId: string) {
    const arrayQuestionId = array.map((q) => q.id);
    const questions: Array<Question> = await this.questionRepository.find({
      relations: {
        answers: { user: true },
      },
      where: { id: In(arrayQuestionId) },
    });

    const viewAnswers: Array<ViewInterviewAnswerDto> = questions.map((q) => {
      const yourAnswer: Answer = q.answers.find(
        (a) => a.user.telegramId === telegramId,
      );
      return {
        'Id вопроса': q.id,
        Вопрос: q.body,
        'Правильный ответ': q.correctAnswer,
        'Твой ответ': yourAnswer.body,
        'Статус ответа': yourAnswer.answerStatus,
        'Процент ответивших неправильно':
          (q.answers.filter((a) => a.answerStatus === 'Incorrect').length /
            q.answers.length) *
          100,
      };
    });
    return viewAnswers;
  }

  async getByUserIdAndQuestionId(userId: string, questionId: number) {
    return await this.answerRepository.findOne({
      relations: { question: true, user: true },
      where: { user: { telegramId: userId }, question: { id: questionId } },
    });
  }

  async delete(answerId: number) {
    return await this.answerRepository.delete({ id: answerId });
  }

  async create(answer: Answer) {
    await this.answerRepository.create(answer);
    return await this.answerRepository.save(answer);
  }
}
