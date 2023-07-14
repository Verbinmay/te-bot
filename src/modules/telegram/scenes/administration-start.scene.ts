import {
  EDIT_ADMINISTRATORS,
  EDIT_QUESTIONS,
  EDIT_USERS,
  BACK_TO_MAIN_MENU,
  SAVE_DB,
} from '../constants/buttons';
import {
  EDIT_ADMINISTRATORS_SCENE,
  EDIT_QUESTIONS_SCENE,
  EDIT_USERS_SCENE,
  START_ADMINISTRATION_SCENE,
  START_MAIN_SCENE,
} from '../constants/scenes';
import {
  MS_ADMIN_HELLO_MESSAGE,
  MS_CHOOSE_THE_SUGGESTED_ACTION,
} from '../constants/messages.const';
import * as fs from 'fs';
import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';

import { ContextSceneType } from '../dto/types/context.type';
import { ErrorService } from '../services/error.service';

@Scene(START_ADMINISTRATION_SCENE)
export class AdministrationStartScene {
  constructor(private readonly errorService: ErrorService) {}
  @SceneEnter()
  async sceneEnter(@Ctx() ctx: ContextSceneType) {
    try {
      await ctx.reply(MS_ADMIN_HELLO_MESSAGE, {
        reply_markup: {
          resize_keyboard: true,
          keyboard: [
            [{ text: EDIT_ADMINISTRATORS }],
            [{ text: EDIT_QUESTIONS }],
            [{ text: EDIT_USERS }],
            [{ text: SAVE_DB }],
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
  async handleText(@Ctx() ctx: ContextSceneType) {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const text = ctx.message.text;
      switch (text) {
        case EDIT_ADMINISTRATORS:
          await ctx.scene.enter(EDIT_ADMINISTRATORS_SCENE);
          break;

        case EDIT_QUESTIONS:
          await ctx.scene.enter(EDIT_QUESTIONS_SCENE);
          break;

        case EDIT_USERS:
          await ctx.scene.enter(EDIT_USERS_SCENE);
          break;

        case SAVE_DB:
          const doc = await this.errorService.dbExcel();
          console.log(doc);
          // const fileStream = fs.createReadStream('exel.xlsx');
          // console.log(fileStream);
          await ctx.replyWithDocument({
            source: doc,
            filename: 'exel.xlsx',
          });

          break;

        case BACK_TO_MAIN_MENU:
          await ctx.scene.enter(START_MAIN_SCENE);
          break;

        default:
          await ctx.reply(MS_CHOOSE_THE_SUGGESTED_ACTION);
      }
    } catch (error) {
      await this.errorService.makeError(error, ctx);
      return;
    }
  }
}
