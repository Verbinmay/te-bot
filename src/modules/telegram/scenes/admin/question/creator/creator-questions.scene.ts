import {
  MS_SEND_QUESTION,
  MS_SORRY_ERROR,
} from '../../../../constants/messages.const';
import {
  ADD_QUESTION_CREATOR_SCENE,
  ADD_QUESTION_SCENE,
  START_MAIN_SCENE,
} from '../../../../constants/scenes';
import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';

import { ContextSceneType } from '../../../../dto/types/context.type';
import { BACK_TO_MAIN_MENU, CHANGED_MY_MIND } from '../../../../constants/buttons';
import { CreatorQuestion } from '../../../../entities/question-creator.entity';
import { CreatorQuestionService } from '../../../../services/question.creator.service';
import { getMessageText } from '../../../../utils/get-message-text';
import { getUserId } from '../../../../utils/get-user-id';

const keyboard = [[{ text: BACK_TO_MAIN_MENU }], [{ text: CHANGED_MY_MIND }]];

@Scene(ADD_QUESTION_CREATOR_SCENE)
export class CreatorQuestionsScene {
  constructor(
    private readonly creatorQuestionService: CreatorQuestionService,
  ) {}
  @SceneEnter()
  async sceneEnter(@Ctx() ctx: ContextSceneType) {
    await ctx.reply(MS_SEND_QUESTION, {
      reply_markup: {
        resize_keyboard: true,
        keyboard: keyboard,
      },
    });
  }

  @On('text')
  async textHandle(@Ctx() ctx: ContextSceneType) {
    const text: string = getMessageText(ctx).trim();

    if (text == BACK_TO_MAIN_MENU) {
      await ctx.scene.enter(ADD_QUESTION_SCENE);
    } else if (text == CHANGED_MY_MIND) {
      await this.creatorQuestionService.deleteByTelegramId(getUserId(ctx));
      await ctx.scene.enter(START_MAIN_SCENE);
    } else {
      const creatorQ = new CreatorQuestion();
      creatorQ.telegramId = getUserId(ctx);
      creatorQ.body = text;

      const saved = await this.creatorQuestionService.create(creatorQ);

      if (saved.body !== text) {
        await this.creatorQuestionService.deleteByTelegramId(getUserId(ctx));
        await ctx.reply(MS_SORRY_ERROR);
        await ctx.scene.enter(START_MAIN_SCENE);
      }
      await ctx.scene.enter(ADD_QUESTION_SCENE);
    }
  }
}
