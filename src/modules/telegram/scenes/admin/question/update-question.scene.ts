import {
  ADD_CORRECT_ANSWER_CREATOR,
  ADD_FIRST_WRONG_ANSWER_CREATOR,
  ADD_QUESTION_CREATOR,
  ADD_SECOND_WRONG_ANSWER_CREATOR,
  ADD_THIRD_WRONG_ANSWER_CREATOR,
  BACK_TO_MAIN_MENU,
  BACK_TO_PREVIOUS_MENU,
  UPDATE_QUESTION,
} from '../../../constants/buttons';
import {
  CHANGE_CORRECT_ANSWER_ADMIN_SCENE,
  CHANGE_FIRST_ANSWER_ADMIN_SCENE,
  CHANGE_QUESTION_ADMIN_SCENE,
  CHANGE_SECOND_ANSWER_ADMIN_SCENE,
  CHANGE_THIRD_ANSWER_ADMIN_SCENE,
  EDIT_QUESTIONS_SCENE,
  START_MAIN_SCENE,
  UPDATE_QUESTION_SCENE,
} from '../../../constants/scenes';
import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';

import { ContextSceneType } from '../../../dto/types/context.type';
import { MS_SELECT_AN_ACTION } from '../../../constants/messages.const';
import { QuestionService } from '../../../services/question.service';
import { getMessageText } from '../../../utils/get-message-text';

@Scene(UPDATE_QUESTION_SCENE)
export class UpdateQuestionScene {
  constructor(private questionService: QuestionService) {}
  @SceneEnter()
  async sceneEnter(@Ctx() ctx: ContextSceneType) {
    await ctx.reply(MS_SELECT_AN_ACTION, {
      reply_markup: {
        resize_keyboard: true,
        keyboard: [
          [{ text: ADD_QUESTION_CREATOR }],
          [{ text: ADD_CORRECT_ANSWER_CREATOR }],
          [{ text: ADD_FIRST_WRONG_ANSWER_CREATOR }],
          [{ text: ADD_SECOND_WRONG_ANSWER_CREATOR }],
          [{ text: ADD_THIRD_WRONG_ANSWER_CREATOR }],
          [{ text: BACK_TO_PREVIOUS_MENU }],
          [{ text: BACK_TO_MAIN_MENU }],
        ],
      },
    });
  }

  @On('text')
  async onText(@Ctx() ctx: ContextSceneType) {
    const text = getMessageText(ctx);

    switch (text) {
      case BACK_TO_PREVIOUS_MENU:
        await ctx.scene.enter(EDIT_QUESTIONS_SCENE);
        break;
      case BACK_TO_MAIN_MENU:
        await ctx.scene.enter(START_MAIN_SCENE);
        break;
      case ADD_QUESTION_CREATOR:
        await ctx.scene.enter(CHANGE_QUESTION_ADMIN_SCENE);
        break;
      case ADD_CORRECT_ANSWER_CREATOR:
        await ctx.scene.enter(CHANGE_CORRECT_ANSWER_ADMIN_SCENE);
        break;
      case ADD_FIRST_WRONG_ANSWER_CREATOR:
        await ctx.scene.enter(CHANGE_FIRST_ANSWER_ADMIN_SCENE);
        break;
      case ADD_SECOND_WRONG_ANSWER_CREATOR:
        await ctx.scene.enter(CHANGE_SECOND_ANSWER_ADMIN_SCENE);
        break;
      case ADD_THIRD_WRONG_ANSWER_CREATOR:
        await ctx.scene.enter(CHANGE_THIRD_ANSWER_ADMIN_SCENE);
        break;
      default:
        await ctx.scene.enter(UPDATE_QUESTION_SCENE);
    }
  }
}
