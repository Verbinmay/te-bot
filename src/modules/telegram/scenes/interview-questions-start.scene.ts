/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  INTERVIEW_QUESTIONS_SCENE,
  QUICK_QUESTIONS_SCENE,
  START_INTERVIEW_SCENE,
  START_MAIN_SCENE,
  START_QUIZ_SCENE,
} from '../constants/scenes';
import {
  MS_ANSWERS_DONE,
  MS_CHOOSE_THE_SUGGESTED_DIAPASON,
  MS_NO_QUESTIONS,
} from '../constants/messages.const';
import { log } from 'console';
import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';

import { ContextSceneType } from '../dto/types/context.type';
import { BACK_TO_MAIN_MENU, LETS_START_FIESTA } from '../constants/buttons';
import { Question } from '../entities/question.entity';
import { User } from '../entities/user.entity';
import { QuestionService } from '../services/question.service';
import { UserService } from '../services/user.service';
import { getUserId } from '../utils/get-user-id';
import { showDiapasonQuestions } from '../utils/show-diapason-of-questions';

@Scene(START_INTERVIEW_SCENE)
export class InterviewStartScene {
  constructor(
    private readonly questionService: QuestionService,
    private readonly userService: UserService,
  ) {}
  @SceneEnter()
  async sceneEnter(@Ctx() ctx: ContextSceneType) {
    const questionCount: number = await this.questionService.getCount();
    const packQuestionsCount = Math.floor(questionCount / 40);
    if (packQuestionsCount === 0) {
      await ctx.reply(MS_NO_QUESTIONS);
      await ctx.scene.enter(START_MAIN_SCENE);
      return;
    } else {
      const questions: Array<Question> =
        await this.questionService.getFortyWithPagination();
      //
      log(questions, 'questions');
      const user: User | null = await this.userService.getByTelegramId(
        getUserId(ctx),
      );

      //@ts-ignore
      ctx.scene.state.question = questions;
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
    }
  }

  @On('text')
  async handleText(@Ctx() ctx: ContextSceneType) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const text = ctx.message.text;

    if (text === BACK_TO_MAIN_MENU) {
      await ctx.scene.enter(START_MAIN_SCENE);
      return;
    } else if (text === LETS_START_FIESTA) {
      await ctx.scene.enter(INTERVIEW_QUESTIONS_SCENE, { ...ctx.scene.state });
      return;
    }
  }
}
