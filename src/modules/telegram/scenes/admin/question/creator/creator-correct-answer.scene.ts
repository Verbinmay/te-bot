import {
  MS_SEND_CORRECT_ANSWER,
  MS_SORRY_ERROR,
} from '../../../../constants/messages.const';
import {
  ADD_CORRECT_ANSWER_CREATOR_SCENE,
  ADD_QUESTION_SCENE,
  START_MAIN_SCENE,
} from '../../../../constants/scenes';
import {
  BACK_TO_MAIN_MENU,
  CHANGED_MY_MIND,
} from '../../../../constants/buttons';
import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { ErrorService } from 'src/modules/telegram/services/error.service';

import { ContextSceneType } from '../../../../dto/types/context.type';
import { CreatorQuestion } from '../../../../entities/question-creator.entity';
import { CreatorQuestionService } from '../../../../services/question.creator.service';
import { getMessageText } from '../../../../utils/get-message-text';
import { getUserId } from '../../../../utils/get-user-id';

const keyboard = [[{ text: BACK_TO_MAIN_MENU }], [{ text: CHANGED_MY_MIND }]];

@Scene(ADD_CORRECT_ANSWER_CREATOR_SCENE)
export class AddCorrectAnswerCreatorScene {
  constructor(
    private readonly creatorQuestionService: CreatorQuestionService,
    private readonly errorService: ErrorService,
  ) {}
  @SceneEnter()
  async sceneEnter(@Ctx() ctx: ContextSceneType) {
    try {
      await ctx.reply(MS_SEND_CORRECT_ANSWER, {
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
        await ctx.scene.enter(ADD_QUESTION_SCENE);
      } else if (text == CHANGED_MY_MIND) {
        await this.creatorQuestionService.deleteByTelegramId(getUserId(ctx));
        await ctx.scene.enter(START_MAIN_SCENE);
      } else {
        const creatorQ: CreatorQuestion | null =
          await this.creatorQuestionService.getByTelegramId(getUserId(ctx));

        creatorQ.correctAnswer = text;

        const updated = await this.creatorQuestionService.update(creatorQ);

        if (updated.correctAnswer !== text) {
          await this.creatorQuestionService.deleteByTelegramId(getUserId(ctx));
          await ctx.reply(MS_SORRY_ERROR);
          await ctx.scene.enter(START_MAIN_SCENE);
        }
        await ctx.scene.enter(ADD_QUESTION_SCENE);
      }
    } catch (error) {
      await this.errorService.makeError(error, ctx);
      return;
    }
  }
}
