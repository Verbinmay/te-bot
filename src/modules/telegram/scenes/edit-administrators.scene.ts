import {
  ADD_ADMINISTRATOR,
  BACK_TO_MAIN_MENU,
  BACK_TO_PREVIOUS_MENU,
  REMOVE_ADMINISTRATOR,
} from '../constants/buttons';
import {
  ADD_NEW_ADMINISTRATOR_SCENE,
  DELETE_ADMINISTRATOR_SCENE,
  EDIT_ADMINISTRATORS_SCENE,
  START_ADMINISTRATION_SCENE,
  START_MAIN_SCENE,
} from '../constants/scenes';
import {
  MS_CHOOSE_THE_SUGGESTED_ACTION,
  MS_SELECT_AN_ACTION,
} from '../constants/messages.const';
import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';

import { ContextSceneType } from '../dto/types/context.type';
import { getMessageText } from '../utils/get-message-text';

@Scene(EDIT_ADMINISTRATORS_SCENE)
export class EditAdministratorsScene {
  @SceneEnter()
  async sceneEnter(@Ctx() ctx: ContextSceneType) {
    await ctx.reply(MS_CHOOSE_THE_SUGGESTED_ACTION, {
      reply_markup: {
        resize_keyboard: true,
        keyboard: [
          [{ text: ADD_ADMINISTRATOR }],
          [{ text: REMOVE_ADMINISTRATOR }],
          [{ text: BACK_TO_PREVIOUS_MENU }],
        ],
      },
    });
  }

  @On('text')
  async textHandle(@Ctx() ctx: ContextSceneType) {
    const text = getMessageText(ctx);
    switch (text) {
      case ADD_ADMINISTRATOR:
        await ctx.scene.enter(ADD_NEW_ADMINISTRATOR_SCENE);
        break;
      case REMOVE_ADMINISTRATOR:
        await ctx.scene.enter(DELETE_ADMINISTRATOR_SCENE, ctx.scene.state);
        break;
      case BACK_TO_PREVIOUS_MENU:
        await ctx.scene.enter(START_ADMINISTRATION_SCENE, ctx.scene.state);
        break;
      case BACK_TO_MAIN_MENU:
        await ctx.scene.enter(START_MAIN_SCENE, ctx.scene.state);
        break;
      default:
        await ctx.reply(MS_SELECT_AN_ACTION, {
          reply_markup: {
            keyboard: [
              [{ text: ADD_ADMINISTRATOR }],
              [{ text: REMOVE_ADMINISTRATOR }],
              [{ text: BACK_TO_PREVIOUS_MENU }],
              [{ text: BACK_TO_MAIN_MENU }],
            ],
          },
        });
    }
  }
}
