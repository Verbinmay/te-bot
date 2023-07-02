import {
  BACK_TO_MAIN_MENU,
  BACK_TO_PREVIOUS_MENU,
  BAN_USER,
  UNBAN_USER,
} from '../../constants/buttons';
import {
  BAN_USER_SCENE,
  EDIT_USERS_SCENE,
  START_ADMINISTRATION_SCENE,
  START_MAIN_SCENE,
  UNBAN_USER_SCENE,
} from '../../constants/scenes';
import {
  MS_CHOOSE_THE_SUGGESTED_ACTION,
  MS_SELECT_AN_ACTION,
} from '../../constants/messages.const';
import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';

import { ContextSceneType } from '../../dto/types/context.type';
import { getMessageText } from '../../utils/get-message-text';

const keyboard = [
  [{ text: BAN_USER }],
  [{ text: UNBAN_USER }],
  [{ text: BACK_TO_PREVIOUS_MENU }],
];

@Scene(EDIT_USERS_SCENE)
export class EditUsersScene {
  @SceneEnter()
  async sceneEnter(@Ctx() ctx: ContextSceneType) {
    await ctx.reply(MS_CHOOSE_THE_SUGGESTED_ACTION, {
      reply_markup: {
        resize_keyboard: true,
        keyboard: keyboard,
      },
    });
  }

  @On('text')
  async textHandle(@Ctx() ctx: ContextSceneType) {
    const text = getMessageText(ctx);
    switch (text) {
      case BAN_USER:
        await ctx.scene.enter(BAN_USER_SCENE);
        break;
      case UNBAN_USER:
        await ctx.scene.enter(UNBAN_USER_SCENE);
        break;
      case BACK_TO_PREVIOUS_MENU:
        await ctx.scene.enter(START_ADMINISTRATION_SCENE);
        break;
      case BACK_TO_MAIN_MENU:
        await ctx.scene.enter(START_MAIN_SCENE);
        break;
      default:
        await ctx.reply(MS_SELECT_AN_ACTION, {
          reply_markup: {
            keyboard: [...keyboard, [{ text: BACK_TO_MAIN_MENU }]],
          },
        });
    }
  }
}
