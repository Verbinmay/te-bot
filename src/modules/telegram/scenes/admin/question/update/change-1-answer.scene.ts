import { BACK_TO_MAIN_MENU } from 'src/modules/telegram/constants/buttons';
import {
  MS_SEND_ID_AND_UPDATE_WRONG_ANSWER,
  MS_WRONG_ID_QUESTION,
  MS_WRONG_TEXT_ANSWER,
} from 'src/modules/telegram/constants/messages.const';
import {
  CHANGE_FIRST_ANSWER_ADMIN_SCENE,
  UPDATE_QUESTION_SCENE,
} from 'src/modules/telegram/constants/scenes';
import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { ContextSceneType } from 'src/modules/telegram/dto/types/context.type';
import { Question } from 'src/modules/telegram/entities/question.entity';
import { ErrorService } from 'src/modules/telegram/services/error.service';
import { QuestionService } from 'src/modules/telegram/services/question.service';
import { getMessageText } from 'src/modules/telegram/utils/get-message-text';
import { showObjectLikeString } from 'src/modules/telegram/utils/show-object-like-string';

const keyboard = [[{ text: BACK_TO_MAIN_MENU }]];

@Scene(CHANGE_FIRST_ANSWER_ADMIN_SCENE)
export class Q_ChangeFirstAnswerScene {
  constructor(
    private readonly questionService: QuestionService,
    private readonly errorService: ErrorService,
  ) {}
  @SceneEnter()
  async sceneEnter(@Ctx() ctx: ContextSceneType) {
    try {
      await ctx.reply(MS_SEND_ID_AND_UPDATE_WRONG_ANSWER, {
        reply_markup: {
          resize_keyboard: true,
          keyboard: keyboard,
        },
      });
    } catch (error) {
      await this.errorService.makeError(error, ctx);
      return;
    }
  }

  @On('text')
  async textHandle(@Ctx() ctx: ContextSceneType) {
    try {
      const text: string = getMessageText(ctx).trim();

      if (text == BACK_TO_MAIN_MENU) {
        await ctx.scene.enter(UPDATE_QUESTION_SCENE);
      } else {
        const [questionId, newFirstAnswer] = text.split('|');
        if (isNaN(Number(questionId.trim()))) {
          await ctx.reply(MS_WRONG_ID_QUESTION);
          await ctx.scene.enter(CHANGE_FIRST_ANSWER_ADMIN_SCENE);
          return;
        }
        if (newFirstAnswer.trim().length < 1) {
          await ctx.reply(MS_WRONG_TEXT_ANSWER);
          await ctx.scene.enter(CHANGE_FIRST_ANSWER_ADMIN_SCENE);
          return;
        }

        const question: Question | null = await this.questionService.getById(
          Number(questionId.trim()),
        );
        if (!question) {
          await ctx.reply(MS_WRONG_ID_QUESTION);
          await ctx.scene.enter(CHANGE_FIRST_ANSWER_ADMIN_SCENE);
          return;
        }
        question.answer_1 = newFirstAnswer.trim();

        const saved = await this.questionService.update(question);

        await ctx.reply(
          `Вопрос с id ${saved.id} обновлён:\n\n${showObjectLikeString(saved)}`,
        );
        await ctx.scene.enter(UPDATE_QUESTION_SCENE);
      }
    } catch (error) {
      await this.errorService.makeError(error, ctx);
      return;
    }
  }
}
