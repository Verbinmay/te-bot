/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  QUICK_QUESTIONS_SCENE,
  START_MAIN_SCENE,
} from '../../constants/scenes';
import * as lodash from 'lodash';
import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { Markup } from 'telegraf';

import { ContextSceneType } from '../../dto/types/context.type';
import { BACK_TO_MAIN_MENU } from '../../constants/buttons';
import { Answer } from '../../entities/answer.entity';
import { Question } from '../../entities/question.entity';
import { User } from '../../entities/user.entity';
import { AnswerService } from '../../services/answer.service';
import { ErrorService } from '../../services/error.service';
import { getMessageText } from '../../utils/get-message-text';
import { showArrayOfObjectsLikeString } from '../../utils/show-array-like-string';

@Scene(QUICK_QUESTIONS_SCENE)
export class QuickQuestionsScene {
  constructor(
    private readonly answerService: AnswerService,
    private readonly errorService: ErrorService,
  ) {}

  @SceneEnter()
  async sceneEnter(@Ctx() ctx: ContextSceneType) {
    try {
      //@ts-ignore
      if (ctx.scene.state.quantity === 20) {
        const incorrectQuestion: Array<Answer> =
          //@ts-ignore
          ctx.scene.state.answers.filter((a) => a.answerStatus === 'Incorrect');

        const incorrectQuestionCount: number = incorrectQuestion.length;
        const incorrectQuestionView =
          incorrectQuestionCount === 0
            ? []
            : incorrectQuestion.map((a) => {
                return {
                  'Id вопроса': a.question.id,
                  // eslint-disable-next-line prettier/prettier
                'Вопрос': a.question.body,
                  'Правильный ответ': a.question.correctAnswer,
                  'Твой ответ': a.body,
                };
              });

        for (let i = 0; i < 20; i++) {
          //@ts-ignore
          const answerState: Answer = ctx.scene.state.answers[i];
          //@ts-ignore
          const user: User = ctx.scene.state.user;

          const answeredBefore: Answer | null =
            await this.answerService.getByUserIdAndQuestionId(
              user.telegramId,
              answerState.question.id,
            );

          if (answeredBefore) {
            await this.answerService.delete(answeredBefore.id);
          }

          await this.answerService.create(answerState);
        }
        ctx.reply(
          `Правильно: ${
            20 - incorrectQuestionCount
          }.\nНеправильно: ${incorrectQuestionCount}\n\nОшибки: ${showArrayOfObjectsLikeString(
            incorrectQuestionView,
          )}`,
        );
        await ctx.scene.enter(START_MAIN_SCENE);
        return;
      }

      const question: Question =
        //@ts-ignore
        ctx.scene.state.question[ctx.scene.state.quantity];

      const random = lodash.shuffle([
        'correctAnswer',
        'answer_1',
        'answer_2',
        'answer_3',
      ]);

      const message = `Вопрос:\n${question.body}\n\nОтвет 1:\n${
        question[random[0]]
      }\nОтвет 2:\n${question[random[1]]}\nОтвет 3:\n${
        question[random[2]]
      }\nОтвет 4:\n${question[random[3]]}`;

      const showAnswerButtonQuestions = (array: Array<string>) => {
        const arrayOfQuestionAnswers: Array<any> = [];

        for (let i = 0; i < array.length; i++) {
          arrayOfQuestionAnswers.push(
            Markup.button.callback(`${i + 1}`, `${array[i]}`),
          );
        }

        return Markup.inlineKeyboard(arrayOfQuestionAnswers, {
          columns: 3,
        });
      };

      await ctx.reply(message, showAnswerButtonQuestions(random));
      await ctx.reply('', {
        reply_markup: {
          resize_keyboard: true,
          keyboard: [[{ text: BACK_TO_MAIN_MENU }]],
        },
      });
    } catch (error) {
      await this.errorService.makeError(error, ctx);
      return;
    }
  }
  @On('callback_query')
  async getQuery(@Ctx() ctx: ContextSceneType) {
    try {
      const a: any = ctx.callbackQuery;

      const question: Question =
        //@ts-ignore
        ctx.scene.state.question[ctx.scene.state.quantity];

      const newAnswer = new Answer();
      //@ts-ignore
      newAnswer.user = ctx.scene.state.user;
      newAnswer.question = question;
      newAnswer.body = question[a.data];

      if (a.data === 'correctAnswer') {
        newAnswer.answerStatus = 'Correct';
      } else {
        newAnswer.answerStatus = 'Incorrect';
      }
      //@ts-ignore
      ctx.scene.state.answers.push(newAnswer);
      //@ts-ignore
      ctx.scene.state.quantity++;
      await ctx.scene.enter(QUICK_QUESTIONS_SCENE, { ...ctx.scene.state });
      return;
    } catch (error) {
      await this.errorService.makeError(error, ctx);
      return;
    }
  }
  @On('text')
  async onText(@Ctx() ctx: ContextSceneType) {
    try {
      const text = getMessageText(ctx);

      if (text === BACK_TO_MAIN_MENU) {
        await ctx.scene.enter(START_MAIN_SCENE);
        return;
      }
    } catch (error) {
      await this.errorService.makeError(error, ctx);
      return;
    }
  }
}
