import {
  GET_MY_WRONG_ANSWERS_SCENE,
  START_MAIN_SCENE,
} from '../constants/scenes';
import {
  MS_NO_WRONG_ANSWERS,
  MS_YOU_WRONG_ANSWERS,
} from '../constants/messages.const';
import { log } from 'console';
import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';

import { ViewWrongAnswerDto } from '../dto/answer/view-wrong-answer-dto';
import { ContextSceneType } from '../dto/types/context.type';
import { BACK_TO_MAIN_MENU } from '../constants/buttons';
import { AnswerService } from '../services/answer.service';
import { getUserId } from '../utils/get-user-id';
import { showArrayOfObjectsLikeString } from '../utils/show-array-like-string';
import { showObjectLikeString } from '../utils/show-object-like-string';

@Scene(GET_MY_WRONG_ANSWERS_SCENE)
export class WrongAnswersStartScene {
  constructor(private readonly answerService: AnswerService) {}
  @SceneEnter()
  async sceneEnter(@Ctx() ctx: ContextSceneType) {
    await ctx.reply(MS_YOU_WRONG_ANSWERS);

    const answers: Array<ViewWrongAnswerDto> =
      await this.answerService.findWrongQuestions(getUserId(ctx));

    if (answers.length > 10) {
      let a = [];
      for (let i = 0; i < answers.length; i++) {
        a.push(answers[i]);

        if (a.length === 10 || i === answers.length - 1) {
          await ctx.reply(showArrayOfObjectsLikeString(a));
          a = [];
        }
      }
    } else if (answers.length === 0) {
      await ctx.reply(MS_NO_WRONG_ANSWERS);
    } else {
      await ctx.reply(showArrayOfObjectsLikeString(answers));
    }

    await ctx.reply('--------', {
      reply_markup: {
        resize_keyboard: true,
        keyboard: [[{ text: BACK_TO_MAIN_MENU }]],
      },
    });
  }

  @On('text')
  async handleText(@Ctx() ctx: ContextSceneType) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const text = ctx.message.text;
    if (text === BACK_TO_MAIN_MENU) {
      await ctx.scene.enter(START_MAIN_SCENE);
    }
  }
}
