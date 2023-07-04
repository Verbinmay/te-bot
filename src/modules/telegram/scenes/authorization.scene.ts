import {
  MS_DONT_USE_PHONE_NUMBER,
  MS_REGISTRATION,
} from '../constants/messages.const';
import {
  START_AUTHORIZATION_SCENE,
  START_MAIN_SCENE,
} from '../constants/scenes';
import { Scene, SceneEnter, Ctx, On } from 'nestjs-telegraf';

import { ContextSceneType } from '../dto/types/context.type';
import { AUTHORIZATION } from '../constants/buttons';
import { ErrorService } from '../services/error.service';
import { UserService } from '../services/user.service';

@Scene(START_AUTHORIZATION_SCENE)
export class AuthorizationScene {
  constructor(
    private readonly userService: UserService,
    private readonly errorService: ErrorService,
  ) {}

  @SceneEnter()
  async sceneEnter(@Ctx() ctx: ContextSceneType) {
    try {
      await ctx.reply(MS_REGISTRATION);
      await ctx.reply(MS_DONT_USE_PHONE_NUMBER, {
        reply_markup: {
          resize_keyboard: true,
          keyboard: [[{ text: AUTHORIZATION, request_contact: true }]],
        },
      });
    } catch (error) {
      await this.errorService.makeError(error, ctx);
      return;
    }
  }

  @On('contact')
  async phone(@Ctx() ctx) {
    try {
      const contact = ctx.message.from;
      await this.userService.create({
        role: 'user',
        firstName: contact.first_name ?? '-',
        lastName: contact.last_name ?? '-',
        userName: contact.username,
        telegramId: contact.id.toString(),
      });
      await ctx.scene.enter(START_MAIN_SCENE);
    } catch (error) {
      await this.errorService.makeError(error, ctx);
      return;
    }
  }
}
