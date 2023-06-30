import {
  MS_DONT_USE_PHONE_NUMBER,
  MS_REGISTRATION,
} from '../constants/messages.const';
import { Scene, SceneEnter, Ctx, On } from 'nestjs-telegraf';

import { ContextSceneType } from '../dto/types/context.type';
import { AUTHORIZATION } from '../constants/buttons';
import {
  START_AUTHORIZATION_SCENE,
  START_MAIN_SCENE,
} from '../constants/scenes';
import { UserService } from '../services/user.service';

@Scene(START_AUTHORIZATION_SCENE)
export class AuthorizationScene {
  constructor(private userService: UserService) {}

  @SceneEnter()
  async sceneEnter(@Ctx() ctx: ContextSceneType) {
    await ctx.reply(MS_REGISTRATION);
    await ctx.reply(MS_DONT_USE_PHONE_NUMBER, {
      reply_markup: {
        resize_keyboard: true,
        keyboard: [[{ text: AUTHORIZATION, request_contact: true }]],
      },
    });
  }

  @On('contact')
  async phone(@Ctx() ctx) {
    const contact = ctx.message.contact;
    await this.userService.create({
      role: 'user',
      firstName: contact.first_name,
      lastName: contact.last_name,
      userName: ctx.message.username,
      telegramId: contact.user_id,
    });
    await ctx.scene.enter(START_MAIN_SCENE);
  }
}
