/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  QUICK_QUESTIONS_SCENE,
  START_MAIN_SCENE,
} from '../../constants/scenes';
import { Ctx, Scene, SceneEnter } from 'nestjs-telegraf';

import { ViewAnswerInterviewDto } from '../../dto/answer/view-answer-interview-dto';
import { ViewAnswerQuizDto } from '../../dto/answer/view-answer-quiz-dto';
import { ViewAnswerStateDto } from '../../dto/answer/view-answer-state-dto';
import { ContextSceneType } from '../../dto/types/context.type';
import { Answer } from '../../entities/answer.entity';
import { Question } from '../../entities/question.entity';
import { User } from '../../entities/user.entity';
import { AnswerService } from '../../services/answer.service';
import { UserService } from '../../services/user.service';
import { getUserId } from '../../utils/get-user-id';
import { showArrayOfObjectsLikeString } from '../../utils/show-array-like-string';
import { showObjectLikeString } from '../../utils/show-object-like-string';
import { showArrayOfObjectsByUser } from '../../utils/show-users-or-admins';

@Scene(QUICK_QUESTIONS_SCENE)
export class QuickQuestionsScene {
  constructor(private readonly answerService: AnswerService) {}

  @SceneEnter()
  async sceneEnter(@Ctx() ctx: ContextSceneType) {
    //@ts-ignore
    if (ctx.scene.state.quantity === 20) {
      const incorrectQuestion: Array<Answer> =
        //@ts-ignore
        ctx.scene.state.answers.filter((a) => a.answerStatus === 'Incorrect');

      const incorrectQuestionCount: number = incorrectQuestion.length;
      const incorrectQuestionView: Array<ViewAnswerQuizDto> =
        incorrectQuestionCount === 0
          ? []
          : incorrectQuestion.map((a) => {
              return {
                questionId: a.question.id,
                question: a.question.body,
                correctAnswer: a.question.correctAnswer,
                yourAnswer: a.body,
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

        // const newAnswer = new Answer();
        // newAnswer.user = user;
        // //@ts-ignore
        // newAnswer.question = ctx.scene.state.question[i];
        // newAnswer.answerStatus = answerState.answerStatus;
        // newAnswer.body = answerState.yourAnswer;

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

    await ctx.reply(MS_TYPE_AN_ADMIN_USERNAME, {
      reply_markup: {
        resize_keyboard: true,
        keyboard: [
          [{ text: BACK_TO_PREVIOUS_MENU }],
          [{ text: BACK_TO_MAIN_MENU }],
        ],
      },
    });
  }

  @On('text')
  async onText(@Ctx() ctx: ContextSceneType) {
    const text = getMessageText(ctx);
    if (text.trim()) {
      if (text === BACK_TO_PREVIOUS_MENU) {
        await ctx.scene.enter(EDIT_ADMINISTRATORS_SCENE);
      } else if (text === BACK_TO_MAIN_MENU) {
        await ctx.scene.enter(START_MAIN_SCENE);
      } else {
        const updatedUser: boolean = await this.userService.addAdmin(text);
        if (updatedUser) {
          await ctx.reply(
            `Пользователь с ником: ${text} успешно добавлен в администраторы`,
            {
              reply_markup: {
                resize_keyboard: true,
                keyboard: [
                  [{ text: BACK_TO_PREVIOUS_MENU }],
                  [{ text: BACK_TO_MAIN_MENU }],
                ],
              },
            },
          );
        } else {
          await ctx.reply(`Пользователь с ником ${text} не найден`, {
            reply_markup: {
              resize_keyboard: true,
              keyboard: [
                [{ text: BACK_TO_PREVIOUS_MENU }],
                [{ text: BACK_TO_MAIN_MENU }],
              ],
            },
          });
        }
        await ctx.reply(MS_TYPE_AN_ADMIN_USERNAME);
      }
    } else {
      await ctx.reply(MS_TYPE_AN_ADMIN_USERNAME);
    }
  }
}
