import { Injectable } from '@nestjs/common';

import { ContextSceneType } from '../dto/types/context.type';
import { MS_NO_ADMINS, MS_SORRY_ERROR } from '../constants/messages.const';
import { START_MAIN_SCENE } from '../constants/scenes';
import { User } from '../entities/user.entity';
import { UserService } from './user.service';

@Injectable()
export class ErrorService {
  constructor(private readonly userService: UserService) {}

  async makeError(errorMessage: any, ctx: ContextSceneType) {
    await ctx.reply(MS_SORRY_ERROR);
    console.log(errorMessage, 'errorMessage');
    const admins: Array<User> = await this.userService.getAllAdministrators();
    if (admins.length === 0) {
      await ctx.reply(MS_NO_ADMINS);
    }
    const adminId = admins[0].telegramId;
    const text = `ERROR ${JSON.stringify(errorMessage)}`;
    await ctx.telegram.sendMessage(adminId, text);
    await ctx.scene.enter(START_MAIN_SCENE);
    return;
  }
}
