import {
  BACK_TO_MAIN_MENU,
  BACK_TO_PREVIOUS_MENU,
} from '../../../constants/buttons';
import {
  EDIT_USERS_SCENE,
  START_MAIN_SCENE,
  UNBAN_USER_SCENE,
} from '../../../constants/scenes';
import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';

import { ContextSceneType } from '../../../dto/types/context.type';
import { MS_TYPE_AN_USER_USERNAME } from '../../../constants/messages.const';
import { User } from '../../../entities/user.entity';
import { UserService } from '../../../services/user.service';
import { getMessageText } from '../../../utils/get-message-text';

@Scene(UNBAN_USER_SCENE)
export class UnBanUserScene {
  constructor(private readonly userService: UserService) {}

  @SceneEnter()
  async sceneEnter(@Ctx() ctx: ContextSceneType) {
    await ctx.reply(MS_TYPE_AN_USER_USERNAME, {
      reply_markup: {
        resize_keyboard: true,
        keyboard: [
          [{ text: BACK_TO_PREVIOUS_MENU }],
          [{ text: BACK_TO_MAIN_MENU }],
        ],
      },
    });
  }

  @On('text')
  async onText(@Ctx() ctx: ContextSceneType) {
    const text = getMessageText(ctx);
    if (text.trim()) {
      if (text === BACK_TO_PREVIOUS_MENU) {
        await ctx.scene.enter(EDIT_USERS_SCENE);
      } else if (text === BACK_TO_MAIN_MENU) {
        await ctx.scene.enter(START_MAIN_SCENE);
      } else {
        const user: User | null = await this.userService.getByUserName(text);
        user.isBaned = false;
        const bannedUser = await this.userService.update(user);

        if (bannedUser.isBaned === false) {
          await ctx.reply(`Пользователь с ником: ${text} успешно разабанен`, {
            reply_markup: {
              resize_keyboard: true,
              keyboard: [
                [{ text: BACK_TO_PREVIOUS_MENU }],
                [{ text: BACK_TO_MAIN_MENU }],
              ],
            },
          });
        } else {
          await ctx.reply(`Пользователь с ником ${text} не найден`, {
            reply_markup: {
              resize_keyboard: true,
              keyboard: [
                [{ text: BACK_TO_PREVIOUS_MENU }],
                [{ text: BACK_TO_MAIN_MENU }],
              ],
            },
          });
        }
        await ctx.reply(MS_TYPE_AN_USER_USERNAME);
      }
    } else {
      await ctx.reply(MS_TYPE_AN_USER_USERNAME);
    }
  }
}
