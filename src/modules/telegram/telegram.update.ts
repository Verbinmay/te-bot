import {
  START_AUTHORIZATION_SCENE,
  START_MAIN_SCENE,
} from './constants/scenes';
import { Ctx, Start, Update } from 'nestjs-telegraf';

import { ContextSceneType } from './dto/types/context.type';
import { UserService } from './services/user.service';

@Update()
export class TelegramUpdate {
  constructor(private userService: UserService) {}

  @Start()
  async onStart(@Ctx() ctx: ContextSceneType) {
    const user = await this.userService.getByTelegramId(
      ctx.message.from.id.toString(),
    );
    if (user) {
      await ctx.scene.enter(START_MAIN_SCENE);
    } else {
      await ctx.scene.enter(START_AUTHORIZATION_SCENE);
    }
  }
}
