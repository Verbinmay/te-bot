import {
  EDIT_ADMINISTRATORS,
  EDIT_QUESTIONS,
  EDIT_USERS,
  BACK_TO_MAIN_MENU,
} from '../constants/buttons';
import {
  EDIT_ADMINISTRATORS_SCENE,
  EDIT_QUESTIONS_SCENE,
  EDIT_USERS_SCENE,
  START_ADMINISTRATION_SCENE,
  START_MAIN_SCENE,
} from '../constants/scenes';
import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';

import { ContextSceneType } from '../dto/types/context.type';
import {
  MS_ADMIN_HELLO_MESSAGE,
  MS_CHOOSE_THE_SUGGESTED_ACTION,
} from '../constants/messages.const';

@Scene(START_ADMINISTRATION_SCENE)
export class AdministrationStartScene {
  @SceneEnter()
  async sceneEnter(@Ctx() ctx: ContextSceneType) {
    await ctx.reply(MS_ADMIN_HELLO_MESSAGE, {
      reply_markup: {
        resize_keyboard: true,
        keyboard: [
          [{ text: EDIT_ADMINISTRATORS }],
          [{ text: EDIT_QUESTIONS }],
          [{ text: EDIT_USERS }],
          [{ text: BACK_TO_MAIN_MENU }],
        ],
      },
    });
  }

  @On('text')
  async handleText(@Ctx() ctx: ContextSceneType) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const text = ctx.message.text;
    switch (text) {
      case EDIT_ADMINISTRATORS:
        await ctx.scene.enter(EDIT_ADMINISTRATORS_SCENE);
        break;

      case EDIT_QUESTIONS:
        await ctx.scene.enter(EDIT_QUESTIONS_SCENE);
        break;

      case EDIT_USERS:
        await ctx.scene.enter(EDIT_USERS_SCENE);
        break;

      case BACK_TO_MAIN_MENU:
        await ctx.scene.enter(START_MAIN_SCENE);
        break;

      default:
        await ctx.reply(MS_CHOOSE_THE_SUGGESTED_ACTION);
    }
  }
}
