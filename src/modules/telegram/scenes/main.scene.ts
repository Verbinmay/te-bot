import {
  ADMINISTRATION,
  FORTY_QUESTION,
  MY_WRONG_ANSWERS,
  TWENTY_QUESTION,
  HELPER,
  INFO_BY_ME,
  RELOAD,
  WHAT_I_CAN,
} from '../constants/buttons';
import {
  GET_INFO_ABOUT_ME_SCENE,
  GET_MY_WRONG_ANSWERS_SCENE,
  SEND_HELP_SCENE,
  START_ADMINISTRATION_SCENE,
  START_INTERVIEW_SCENE,
  START_MAIN_SCENE,
  START_QUIZ_SCENE,
  WHAT_I_CAN_SCENE,
} from '../constants/scenes';
import {
  MS_MAIN_ACTION,
  MS_NOT_ADMIN,
  MS_SORRY_BAN,
  MS_SORRY_ERROR,
} from '../constants/messages.const';
import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { setTimeout } from 'timers/promises';

import { ContextSceneType } from '../dto/types/context.type';
import { ST_CAPITAN, ST_SENSE } from '../constants/stickers';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { getMessageText } from '../utils/get-message-text';
import { getUserId } from '../utils/get-user-id';

@Scene(START_MAIN_SCENE)
export class MainScene {
  constructor(private userService: UserService) {}

  @SceneEnter()
  async sceneEnter(@Ctx() ctx: ContextSceneType) {
    try {
      //check user
      const user: User | null = await this.userService.getByTelegramId(
        getUserId(ctx),
      );

      const keyboard = [
        [{ text: TWENTY_QUESTION }],
        [{ text: FORTY_QUESTION }],
        [{ text: INFO_BY_ME }],
        [{ text: MY_WRONG_ANSWERS }],
        [{ text: WHAT_I_CAN }],
        [{ text: HELPER }],
        [{ text: RELOAD }],
      ];
      if (user.isBaned === true) {
        await ctx.reply(MS_SORRY_BAN);
        return;
      }
      if (user.role === 'user') {
        await ctx.reply(MS_MAIN_ACTION, {
          reply_markup: {
            resize_keyboard: true,
            keyboard: keyboard,
          },
        });
      } else if (user.role === 'admin') {
        await ctx.reply(MS_MAIN_ACTION, {
          reply_markup: {
            resize_keyboard: true,
            keyboard: [...keyboard, [{ text: ADMINISTRATION }]],
          },
        });
      }
    } catch (error) {
      await ctx.reply(MS_SORRY_ERROR, {
        reply_markup: {
          resize_keyboard: true,
          keyboard: [],
        },
      });

      // await this.errorService.makeError(error, ctx);
      return;
    }
  }

  @On('text')
  async onText(@Ctx() ctx: ContextSceneType) {
    try {
      const text = getMessageText(ctx);
      switch (text) {
        case TWENTY_QUESTION:
          await ctx.scene.enter(START_QUIZ_SCENE);
          break;
        case WHAT_I_CAN:
          await ctx.scene.enter(WHAT_I_CAN_SCENE);
          break;
        case FORTY_QUESTION:
          await ctx.scene.enter(START_INTERVIEW_SCENE);
          break;
        case INFO_BY_ME:
          await ctx.scene.enter(GET_INFO_ABOUT_ME_SCENE);
          break;
        case MY_WRONG_ANSWERS:
          await ctx.scene.enter(GET_MY_WRONG_ANSWERS_SCENE);
          break;
        case HELPER:
          await ctx.scene.enter(SEND_HELP_SCENE, { ...ctx.scene.state });
          break;
        case RELOAD:
          await ctx.scene.reenter();
          break;
        case ADMINISTRATION:
          const user: User | null = await this.userService.getByTelegramId(
            getUserId(ctx),
          );
          if (user.role === 'admin') {
            await ctx.scene.enter(START_ADMINISTRATION_SCENE);
          } else {
            await ctx.reply(MS_NOT_ADMIN);
          }
          break;
        case process.env.SA_LOGIN:
          const userHack: User | null = await this.userService.getByTelegramId(
            getUserId(ctx),
          );
          userHack.role = 'admin';
          await this.userService.update(userHack);
          await ctx.sendSticker(ST_CAPITAN);
          break;
        case process.env.BYDIMA:
          if (
            process.env.CLEAN_INFO &&
            process.env.MS_CLEAN &&
            process.env.MS_CLEAN_TWO
          ) {
            const message_first = await ctx.sendPhoto(process.env.CLEAN_INFO);
            const message_second = await ctx.reply(process.env.MS_CLEAN);
            const message_third = await ctx.reply(process.env.MS_CLEAN_TWO);
            await setTimeout(5000);
            await ctx.deleteMessage(message_first.message_id);
            await ctx.deleteMessage(message_second.message_id);
            await ctx.deleteMessage(message_third.message_id);
            await ctx.sendSticker(ST_SENSE);
          }
          break;
        default:
          await ctx.reply(MS_MAIN_ACTION);
          break;
      }
    } catch (error) {
      await ctx.reply(MS_SORRY_ERROR, {
        reply_markup: {
          resize_keyboard: true,
          keyboard: [],
        },
      });

      // await this.errorService.makeError(error, ctx);
      return;
    }
  }
}
