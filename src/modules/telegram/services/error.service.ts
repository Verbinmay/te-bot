import { writeFileSync } from 'fs';
import * as XLSX from 'xlsx';
import { write } from 'xlsx';

import { Injectable } from '@nestjs/common';

import { ContextSceneType } from '../dto/types/context.type';
import { MS_NO_ADMINS, MS_SORRY_ERROR } from '../constants/messages.const';
import { START_MAIN_SCENE } from '../constants/scenes';
import { Answer } from '../entities/answer.entity';
import { Question } from '../entities/question.entity';
import { User } from '../entities/user.entity';
import { AnswerService } from './answer.service';
import { QuestionService } from './question.service';
import { UserService } from './user.service';

@Injectable()
export class ErrorService {
  constructor(
    private readonly userService: UserService,
    private readonly questionService: QuestionService,
    private readonly answerService: AnswerService,
  ) {}

  async makeError(errorMessage: any, ctx: ContextSceneType) {
    await ctx.reply(MS_SORRY_ERROR);
    console.log(errorMessage, 'errorMessage');
    const admins: Array<User> = await this.userService.getAllAdministrators();
    if (admins.length === 0) {
      await ctx.reply(MS_NO_ADMINS);
    }
    const adminId = admins[0].telegramId;
    const text = `ERROR ${JSON.stringify(errorMessage)}`;
    await ctx.telegram.sendMessage(adminId, text);
    await ctx.scene.enter(START_MAIN_SCENE);
    return;
  }

  async dbExcel() {
    const workbook = XLSX.utils.book_new();

    const users: Array<User> = await this.userService.getAllUsers();
    const questions: Array<Question> =
      await this.questionService.getAllQuestions();
    const answers = await this.answerService.getAllAnswersMap();

    const worksheet_users = XLSX.utils.json_to_sheet(users);
    const worksheet_questions = XLSX.utils.json_to_sheet(questions);
    const worksheet_answers = XLSX.utils.json_to_sheet(answers);

    XLSX.utils.book_append_sheet(workbook, worksheet_users, 'worksheet_users');
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet_questions,
      'worksheet_questions',
    );
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet_answers,
      'worksheet_answers',
    );

    const data = XLSX.write(workbook, { type: 'buffer' });

    return data;
  }
}
