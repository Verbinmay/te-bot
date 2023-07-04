import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';

import { ContextSceneType } from '../dto/types/context.type';
import { BACK_TO_MAIN_MENU } from '../constants/buttons';
import { GET_INFO_ABOUT_ME_SCENE, START_MAIN_SCENE } from '../constants/scenes';
import { User } from '../entities/user.entity';
import { AnswerService } from '../services/answer.service';
import { ErrorService } from '../services/error.service';
import { QuestionService } from '../services/question.service';
import { UserService } from '../services/user.service';
import { getUserId } from '../utils/get-user-id';

@Scene(GET_INFO_ABOUT_ME_SCENE)
export class GetInfoStartScene {
  constructor(
    private readonly userService: UserService,
    private readonly errorService: ErrorService,
    private readonly questionService: QuestionService,
  ) {}
  @SceneEnter()
  async sceneEnter(@Ctx() ctx: ContextSceneType) {
    try {
      await ctx.reply(
        `Тебя зовут: ${ctx.from.first_name}!\nИграй и тут будут отображаться твои успехи!`,
      );
      const user: User = await this.userService.getByTelegramIdWithAnswers(
        getUserId(ctx),
      );

      const questionCount: number = await this.questionService.getCount();

      const rightAnswers = user.answers.filter(
        (a) => a.answerStatus === 'Correct',
      ).length;

      const message = `Общее количество вопросов: ${questionCount}\nКоличество правильных ответов:${rightAnswers}\nКоличество неправильных ответов: ${
        user.answers.filter((a) => a.answerStatus === 'Incorrect').length
      }\nПроцент правильных ответов: ${Math.floor(
        (rightAnswers / user.answers.length) * 100,
      )}\nВы на ${Math.floor(rightAnswers / 10)} ступени из ${Math.floor(
        questionCount / 10,
      )}`;

      await ctx.reply(message, {
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

  @On('text')
  async handleText(@Ctx() ctx: ContextSceneType) {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const text = ctx.message.text;
      if (text === BACK_TO_MAIN_MENU) {
        await ctx.scene.enter(START_MAIN_SCENE);
      }
    } catch (error) {
      await this.errorService.makeError(error, ctx);
      return;
    }
  }
}
