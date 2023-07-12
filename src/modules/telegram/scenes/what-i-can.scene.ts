import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';

import { ContextSceneType } from '../dto/types/context.type';
import { BACK_TO_MAIN_MENU } from '../constants/buttons';
import { MS_INFO_BOT } from '../constants/messages.const';
import { START_MAIN_SCENE, WHAT_I_CAN_SCENE } from '../constants/scenes';
import { ErrorService } from '../services/error.service';

@Scene(WHAT_I_CAN_SCENE)
export class WhatICanScene {
  constructor(private readonly errorService: ErrorService) {}
  @SceneEnter()
  async sceneEnter(@Ctx() ctx: ContextSceneType) {
    try {
      await ctx.reply(MS_INFO_BOT, {
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
      switch (text) {
        case BACK_TO_MAIN_MENU:
          await ctx.scene.enter(START_MAIN_SCENE, { ...ctx.scene.state });
          break;
        default:
          await ctx.scene.enter(WHAT_I_CAN_SCENE, { ...ctx.scene.state });
          break;
      }
    } catch (error) {
      await this.errorService.makeError(error, ctx);
      return;
    }
  }
}
