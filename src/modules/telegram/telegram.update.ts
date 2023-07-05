import {
  START_AUTHORIZATION_SCENE,
  START_MAIN_SCENE,
} from './constants/scenes';
import { log } from 'console';
import { Ctx, Start, Update } from 'nestjs-telegraf';

import { ContextSceneType } from './dto/types/context.type';
import { MS_HELLO_MESSAGE, MS_SORRY_BAN } from './constants/messages.const';
import { ST_CAT0$0 } from './constants/stickers';
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
      if (user.isBaned === true) {
        await ctx.reply(MS_SORRY_BAN);
        return;
      }
      await ctx.sendSticker(ST_CAT0$0);
      await ctx.reply(MS_HELLO_MESSAGE);
      await ctx.scene.enter(START_MAIN_SCENE);
    } else {
      await ctx.sendSticker(ST_CAT0$0);
      await ctx.reply(MS_HELLO_MESSAGE);
      await ctx.scene.enter(START_AUTHORIZATION_SCENE);
    }
  }
}
