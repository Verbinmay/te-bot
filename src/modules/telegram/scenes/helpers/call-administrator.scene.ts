/* eslint-disable @typescript-eslint/ban-ts-comment */
import { BACK_TO_MAIN_MENU } from '../../constants/buttons';
import {
  MS_NO_ADMINS,
  MS_SEND_YOUR_PROBLEM,
  MS_THANKS_TO_SENDED_PROBLEM,
} from '../../constants/messages.const';
import * as lodash from 'lodash';
import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';

import { ContextSceneType } from '../../dto/types/context.type';
import { CALL_ADMIN_SCENE, START_MAIN_SCENE } from '../../constants/scenes';
import { User } from '../../entities/user.entity';
import { UserService } from '../../services/user.service';
import { getMessageText } from '../../utils/get-message-text';

@Scene(CALL_ADMIN_SCENE)
export class CallAdministratorScene {
  constructor(private readonly userService: UserService) {}

  @SceneEnter()
  async sceneEnter(@Ctx() ctx: ContextSceneType) {
    const keyboard = [[{ text: BACK_TO_MAIN_MENU }]];

    //@ts-ignore
    if (!ctx.scene.state.adminId) {
      const admins: Array<User> = await this.userService.getAllAdministrators();
      if (admins.length === 0) {
        await ctx.reply(MS_NO_ADMINS);
        await ctx.scene.enter(START_MAIN_SCENE);
      }
      const admin: User = lodash.shuffle(admins)[0];
      ctx.scene.state = { ...ctx.scene.state, adminId: admin.telegramId };
    }
    await ctx.reply(MS_SEND_YOUR_PROBLEM, {
      reply_markup: {
        resize_keyboard: true,
        keyboard: keyboard,
      },
    });
  }

  @On('text')
  async onText(@Ctx() ctx: ContextSceneType) {
    const text = getMessageText(ctx);
    if (text === BACK_TO_MAIN_MENU) {
      await ctx.scene.enter(START_MAIN_SCENE);
    } else {
      //@ts-ignore
      const adminId = ctx.scene.state.adminId;
      const text =
        `Поступила жалоба от пользователя ${ctx.message.from.username}:\n\n` +
        getMessageText(ctx).toString().trim();

      await ctx.telegram.sendMessage(adminId, text);
      await ctx.reply(MS_THANKS_TO_SENDED_PROBLEM);

      await ctx.scene.enter(START_MAIN_SCENE, { ...ctx.scene.state });
    }
  }
}
