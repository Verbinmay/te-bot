import {
  ADD_NEW_ADMINISTRATOR_SCENE,
  EDIT_ADMINISTRATORS_SCENE,
  START_MAIN_SCENE,
} from '../../../constants/scenes';
import {
  BACK_TO_MAIN_MENU,
  BACK_TO_PREVIOUS_MENU,
} from '../../../constants/buttons';
import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { ErrorService } from 'src/modules/telegram/services/error.service';

import { ContextSceneType } from '../../../dto/types/context.type';
import { MS_TYPE_AN_ADMIN_USERNAME } from '../../../constants/messages.const';
import { UserService } from '../../../services/user.service';
import { getMessageText } from '../../../utils/get-message-text';

@Scene(ADD_NEW_ADMINISTRATOR_SCENE)
export class AddNewAdministratorScene {
  constructor(
    private readonly userService: UserService,
    private readonly errorService: ErrorService,
  ) {}

  @SceneEnter()
  async sceneEnter(@Ctx() ctx: ContextSceneType) {
    try {
      await ctx.reply(MS_TYPE_AN_ADMIN_USERNAME, {
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
          await ctx.scene.enter(EDIT_ADMINISTRATORS_SCENE);
        } else if (text === BACK_TO_MAIN_MENU) {
          await ctx.scene.enter(START_MAIN_SCENE);
        } else {
          const updatedUser: boolean = await this.userService.addAdmin(text);
          if (updatedUser) {
            await ctx.reply(
              `Пользователь с ником: ${text} успешно добавлен в администраторы`,
              {
                reply_markup: {
                  resize_keyboard: true,
                  keyboard: [
                    [{ text: BACK_TO_PREVIOUS_MENU }],
                    [{ text: BACK_TO_MAIN_MENU }],
                  ],
                },
              },
            );
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
          await ctx.reply(MS_TYPE_AN_ADMIN_USERNAME);
        }
      } else {
        await ctx.reply(MS_TYPE_AN_ADMIN_USERNAME);
      }
    } catch (error) {
      await this.errorService.makeError(error, ctx);
      return;
    }
  }
}
