import {
  CALL_ADMIN_SCENE,
  SEND_HELP_SCENE,
  START_MAIN_SCENE,
} from '../constants/scenes';
import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';

import { ContextSceneType } from '../dto/types/context.type';
import { BACK_TO_MAIN_MENU, CALL_ADMIN } from '../constants/buttons';
import { MS_CHOOSE_THE_SUGGESTED_ACTION } from '../constants/messages.const';

@Scene(SEND_HELP_SCENE)
export class HelpersStartScene {
  @SceneEnter()
  async sceneEnter(@Ctx() ctx: ContextSceneType) {
    await ctx.reply(MS_CHOOSE_THE_SUGGESTED_ACTION, {
      reply_markup: {
        resize_keyboard: true,
        keyboard: [[{ text: CALL_ADMIN }], [{ text: BACK_TO_MAIN_MENU }]],
      },
    });
  }

  @On('text')
  async handleText(@Ctx() ctx: ContextSceneType) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const text = ctx.message.text;
    switch (text) {
      case CALL_ADMIN:
        await ctx.scene.enter(CALL_ADMIN_SCENE, { ...ctx.scene.state });
        break;

      case BACK_TO_MAIN_MENU:
        await ctx.scene.enter(START_MAIN_SCENE, { ...ctx.scene.state });
        break;

      default:
        await ctx.scene.enter(SEND_HELP_SCENE, { ...ctx.scene.state });
        break;
    }
  }
}
