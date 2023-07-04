/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  QUICK_QUESTIONS_SCENE,
  START_MAIN_SCENE,
  START_QUIZ_SCENE,
} from '../constants/scenes';
import {
  MS_ANSWERS_DONE,
  MS_CHOOSE_THE_SUGGESTED_DIAPASON,
  MS_NO_QUESTIONS,
} from '../constants/messages.const';
import * as lodash from 'lodash';
import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';

import { ContextSceneType } from '../dto/types/context.type';
import { BACK_TO_MAIN_MENU, LETS_START_FIESTA } from '../constants/buttons';
import { User } from '../entities/user.entity';
import { ErrorService } from '../services/error.service';
import { QuestionService } from '../services/question.service';
import { UserService } from '../services/user.service';
import { getUserId } from '../utils/get-user-id';
import { showDiapasonQuestions } from '../utils/show-diapason-of-questions';

@Scene(START_QUIZ_SCENE)
export class QuizStartScene {
  constructor(
    private readonly questionService: QuestionService,
    private readonly userService: UserService,
    private readonly errorService: ErrorService,
  ) {}
  @SceneEnter()
  async sceneEnter(@Ctx() ctx: ContextSceneType) {
    try {
      const questionCount: number = await this.questionService.getCount();
      const packQuestionsCount = Math.floor(questionCount / 20);
      if (packQuestionsCount === 0) {
        await ctx.reply(MS_NO_QUESTIONS);
        await ctx.scene.enter(START_MAIN_SCENE);
        return;
      } else {
        await ctx.reply(
          MS_CHOOSE_THE_SUGGESTED_DIAPASON,
          showDiapasonQuestions(packQuestionsCount),
        );
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
      const questions = await this.questionService.getTwentyWithPagination(
        +a.data,
      );

      const user: User | null = await this.userService.getByTelegramId(
        getUserId(ctx),
      );

      //@ts-ignore
      ctx.scene.state.question = lodash.shuffle(questions);
      //@ts-ignore
      ctx.scene.state.quantity = 0;
      //@ts-ignore
      ctx.scene.state.answers = [];
      //@ts-ignore
      ctx.scene.state.user = user;

      await ctx.reply(MS_ANSWERS_DONE, {
        reply_markup: {
          resize_keyboard: true,
          keyboard: [
            [{ text: BACK_TO_MAIN_MENU }],
            [{ text: LETS_START_FIESTA }],
          ],
        },
      });
    } catch (error) {
      await this.errorService.makeError(error, ctx);
      return;
    }
  }

  @On('text')
  async handleText(@Ctx() ctx: ContextSceneType) {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const text = ctx.message.text;

      if (text === BACK_TO_MAIN_MENU) {
        await ctx.scene.enter(START_MAIN_SCENE);
        return;
      } else if (text === LETS_START_FIESTA) {
        await ctx.scene.enter(QUICK_QUESTIONS_SCENE, { ...ctx.scene.state });
        return;
      }
    } catch (error) {
      await this.errorService.makeError(error, ctx);
      return;
    }
  }
}
