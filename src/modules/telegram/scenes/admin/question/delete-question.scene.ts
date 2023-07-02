import {
  BACK_TO_MAIN_MENU,
  BACK_TO_PREVIOUS_MENU,
} from '../../../constants/buttons';
import {
  DELETE_QUESTION_SCENE,
  EDIT_QUESTIONS_SCENE,
  START_MAIN_SCENE,
} from '../../../constants/scenes';
import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';

import { ContextSceneType } from '../../../dto/types/context.type';
import { MS_SEND_ID_QUESTION } from '../../../constants/messages.const';
import { QuestionService } from '../../../services/question.service';
import { getMessageText } from '../../../utils/get-message-text';

@Scene(DELETE_QUESTION_SCENE)
export class DeleteQuestionScene {
  constructor(private questionService: QuestionService) {}
  @SceneEnter()
  async sceneEnter(@Ctx() ctx: ContextSceneType) {
    await ctx.reply(MS_SEND_ID_QUESTION, {
      reply_markup: {
        resize_keyboard: true,
        keyboard: [
          [{ text: BACK_TO_PREVIOUS_MENU }],
          [{ text: BACK_TO_MAIN_MENU }],
        ],
      },
    });
  }

  @On('text')
  async onText(@Ctx() ctx: ContextSceneType) {
    const text = getMessageText(ctx);
    if (text.trim()) {
      if (text === BACK_TO_PREVIOUS_MENU) {
        await ctx.scene.enter(EDIT_QUESTIONS_SCENE);
      } else if (text === BACK_TO_MAIN_MENU) {
        await ctx.scene.enter(START_MAIN_SCENE);
      } else if (!isNaN(Number(text.trim()))) {
        const deletedQuestion: boolean = await this.questionService.deleteById(
          Number(text),
        );
        if (deletedQuestion) {
          await ctx.reply(`Вопрос с id: ${text} успешно удален`, {
            reply_markup: {
              resize_keyboard: true,
              keyboard: [
                [{ text: BACK_TO_PREVIOUS_MENU }],
                [{ text: BACK_TO_MAIN_MENU }],
              ],
            },
          });
        } else {
          await ctx.reply(`Вопрос с id ${text} не найден`, {
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
        await ctx.reply(MS_SEND_ID_QUESTION);
      }
    } else {
      await ctx.reply(MS_SEND_ID_QUESTION);
    }
  }
}
