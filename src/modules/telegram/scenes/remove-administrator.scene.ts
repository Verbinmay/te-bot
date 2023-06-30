import {
  DELETE_ADMINISTRATOR_SCENE,
  EDIT_ADMINISTRATORS_SCENE,
  START_MAIN_SCENE,
} from '../constants/scenes';
import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';

import { ContextSceneType } from '../dto/types/context.type';
import { SA_ViewAdminDto } from '../dto/user/sa-view-admin.dto';
import { BACK_TO_MAIN_MENU, BACK_TO_PREVIOUS_MENU } from '../constants/buttons';
import { MS_TYPE_AN_ADMIN_ID } from '../constants/messages.const';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { getMessageText } from '../utils/get-message-text';

@Scene(DELETE_ADMINISTRATOR_SCENE)
export class RemoveAdministratorScene {
  constructor(private userService: UserService) {}
  @SceneEnter()
  async sceneEnter(@Ctx() ctx: ContextSceneType) {
    const administratorsFromDb: Array<User> =
      await this.userService.getAllAdministrators();
    const administratorsViewModel: Array<SA_ViewAdminDto> =
      administratorsFromDb.map((a) => {
        return {
          telegramId: a.telegramId,
          userName: a.userName,
          firstName: a.firstName,
          lastName: a.lastName,
          role: a.role,
          createdAt: a.createdAt,
        };
      });
    const administrators: string = showArrayOfObjects(administratorsViewModel);
    await ctx.reply(administrators);

    await ctx.reply(MS_TYPE_AN_ADMIN_ID, {
      reply_markup: {
        keyboard: [[{ text: BACK_TO_PREVIOUS_MENU }]],
      },
    });
  }

  @On('text')
  async onText(@Ctx() ctx: ContextSceneType) {
    const text = getMessageText(ctx);
    if (text.trim()) {
      if (text === BACK_TO_PREVIOUS_MENU) {
        await ctx.scene.enter(EDIT_ADMINISTRATORS_SCENE);
      } else if (text === BACK_TO_MAIN_MENU) {
        await ctx.scene.enter(START_MAIN_SCENE, ctx.scene.state);
      } else if (!isNaN(Number(text.trim()))) {
        const removedAdmin: boolean = await this.userService.removeAdmin(text);
        if (removedAdmin) {
          await ctx.reply(
            `Пользователь с номером: ${text} успешно удален из списка администраторов`,
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
          await ctx.reply(`Администратор с номером ${text} не найден`, {
            reply_markup: {
              resize_keyboard: true,
              keyboard: [
                [{ text: BACK_TO_PREVIOUS_MENU }],
                [{ text: BACK_TO_MAIN_MENU }],
              ],
            },
          });
        }
      } else {
        await ctx.reply(MS_TYPE_AN_ADMIN_ID);
      }
    } else {
      await ctx.reply(MS_TYPE_AN_ADMIN_ID);
    }
  }
}
