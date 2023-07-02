import {
  ADD_QUESTION,
  BACK_TO_MAIN_MENU,
  BACK_TO_PREVIOUS_MENU,
  DELETE_QUESTION,
  EXEL_QUESTION,
  UPDATE_QUESTION,
} from '../../constants/buttons';
import {
  MS_CHOOSE_THE_SUGGESTED_ACTION,
  MS_SELECT_AN_ACTION,
} from '../../constants/messages.const';
import {
  ADD_QUESTION_SCENE,
  DELETE_QUESTION_SCENE,
  EDIT_QUESTIONS_SCENE,
  EXEL_QUESTION_SCENE,
  START_ADMINISTRATION_SCENE,
  START_MAIN_SCENE,
  UPDATE_QUESTION_SCENE,
} from '../../constants/scenes';
import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';

import { ContextSceneType } from '../../dto/types/context.type';
import { getMessageText } from '../../utils/get-message-text';

const keyboard = [
  [{ text: ADD_QUESTION }],
  [{ text: DELETE_QUESTION }],
  [{ text: UPDATE_QUESTION }],
  [{ text: EXEL_QUESTION }],
  [{ text: BACK_TO_PREVIOUS_MENU }],
  [{ text: BACK_TO_MAIN_MENU }],
];

@Scene(EDIT_QUESTIONS_SCENE)
export class EditQuestionsScene {
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
      case ADD_QUESTION:
        await ctx.scene.enter(ADD_QUESTION_SCENE);
        break;
      case DELETE_QUESTION:
        await ctx.scene.enter(DELETE_QUESTION_SCENE);
        break;
      case UPDATE_QUESTION:
        await ctx.scene.enter(UPDATE_QUESTION_SCENE);
        break;
      case EXEL_QUESTION:
        await ctx.scene.enter(EXEL_QUESTION_SCENE);
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
            resize_keyboard: true,
            keyboard: keyboard,
          },
        });
    }
  }
}
