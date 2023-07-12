/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  INTERVIEW_QUESTIONS_SCENE,
  START_MAIN_SCENE,
} from '../../constants/scenes';
import * as lodash from 'lodash';
import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { Markup } from 'telegraf';

import { ViewInterviewAnswerDto } from '../../dto/answer/view-answer-interview-dto';
import { ContextSceneType } from '../../dto/types/context.type';
import { BACK_TO_MAIN_MENU } from '../../constants/buttons';
import { Answer } from '../../entities/answer.entity';
import { Question } from '../../entities/question.entity';
import { User } from '../../entities/user.entity';
import { AnswerService } from '../../services/answer.service';
import { ErrorService } from '../../services/error.service';
import { getMessageText } from '../../utils/get-message-text';
import { getUserId } from '../../utils/get-user-id';
import { showArrayOfObjectsLikeString } from '../../utils/show-array-like-string';

@Scene(INTERVIEW_QUESTIONS_SCENE)
export class InterviewQuestionsScene {
  constructor(
    private readonly answerService: AnswerService,
    private readonly errorService: ErrorService,
  ) {}

  @SceneEnter()
  async sceneEnter(@Ctx() ctx: ContextSceneType) {
    try {
      //@ts-ignore
      if (ctx.scene.state.quantity === 40) {
        /**Созданный массив ответов будет публиковаться в базу данных или перезаписываться, если ранее ответ на вопрос был дан. Будет сформирован ответ пользователю: статистика ответов и сами ответы, отправляемые по 10 за раз */
        for (let i = 0; i < 40; i++) {
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

        const incorrectQuestionCount: number =
          //@ts-ignore
          ctx.scene.state.answers.filter(
            (a) => a.answerStatus === 'Incorrect',
          ).length;

        ctx.reply(
          `Правильно: ${
            40 - incorrectQuestionCount
          }.\nНеправильно: ${incorrectQuestionCount}\n\nТвои вопросы:`,
        );

        const answers: Array<ViewInterviewAnswerDto> =
          await this.answerService.findInterviewQuestions(
            //@ts-ignore
            ctx.scene.state.question,
            getUserId(ctx),
          );

        let a = [];
        for (let i = 0; i < answers.length; i++) {
          a.push(answers[i]);

          if (a.length === 10 || i === answers.length - 1) {
            await ctx.reply(showArrayOfObjectsLikeString(a));
            a = [];
          }
        }
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
      //@ts-ignore
      const message = `${ctx.scene.state.quantity + 1} из 40\nВопрос:\n${
        question.body
      }\n\nОтвет 1:\n${question[random[0]]}\nОтвет 2:\n${
        question[random[1]]
      }\nОтвет 3:\n${question[random[2]]}\nОтвет 4:\n${question[random[3]]}`;

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

      const sendedQuestion = await ctx.reply(
        message,
        showAnswerButtonQuestions(random),
      );
      //@ts-ignore
      ctx.scene.state.messageId = sendedQuestion.message_id;
      //@ts-ignore
      if (ctx.scene.state.quantity === 0) {
        await ctx.reply('-+-+-+-+-+-+-+-+-', {
          reply_markup: {
            resize_keyboard: true,
            keyboard: [[{ text: BACK_TO_MAIN_MENU }]],
          },
        });
      }
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
      //@ts-ignore
      await ctx.deleteMessage(ctx.scene.state.messageId);
      await ctx.scene.enter(INTERVIEW_QUESTIONS_SCENE, { ...ctx.scene.state });
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
