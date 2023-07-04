import {
  BACK_TO_MAIN_MENU,
  BACK_TO_PREVIOUS_MENU,
} from '../../../constants/buttons';
import {
  BAN_USER_SCENE,
  EDIT_USERS_SCENE,
  START_MAIN_SCENE,
} from '../../../constants/scenes';
import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { ErrorService } from 'src/modules/telegram/services/error.service';

import { ContextSceneType } from '../../../dto/types/context.type';
import { MS_TYPE_AN_USER_USERNAME } from '../../../constants/messages.const';
import { User } from '../../../entities/user.entity';
import { UserService } from '../../../services/user.service';
import { getMessageText } from '../../../utils/get-message-text';

@Scene(BAN_USER_SCENE)
export class BanUserScene {
  constructor(
    private readonly userService: UserService,
    private readonly errorService: ErrorService,
  ) {}

  @SceneEnter()
  async sceneEnter(@Ctx() ctx: ContextSceneType) {
    try {
      await ctx.reply(MS_TYPE_AN_USER_USERNAME, {
        reply_markup: {
          resize_keyboard: true,
          keyboard: [
            [{ text: BACK_TO_PREVIOUS_MENU }],
            [{ text: BACK_TO_MAIN_MENU }],
          ],
        },
      });
    } catch (error) {
      await this.errorService.makeError(error, ctx);
      return;
    }
  }

  @On('text')
  async onText(@Ctx() ctx: ContextSceneType) {
    try {
      const text = getMessageText(ctx);
      if (text.trim()) {
        if (text === BACK_TO_PREVIOUS_MENU) {
          await ctx.scene.enter(EDIT_USERS_SCENE);
        } else if (text === BACK_TO_MAIN_MENU) {
          await ctx.scene.enter(START_MAIN_SCENE);
        } else {
          const user: User | null = await this.userService.getByUserName(text);
          user.isBaned = true;
          const bannedUser = await this.userService.update(user);

          if (bannedUser.isBaned === true) {
            await ctx.reply(`Пользователь с ником: ${text} успешно забанен`, {
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
    } catch (error) {
      await this.errorService.makeError(error, ctx);
      return;
    }
  }
}
