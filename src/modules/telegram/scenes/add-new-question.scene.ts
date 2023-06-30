import {
  ADD_CORRECT_ANSWER_CREATOR,
  ADD_FIRST_WRONG_ANSWER_CREATOR,
  ADD_QUESTION_CREATOR,
  ADD_SECOND_WRONG_ANSWER_CREATOR,
  ADD_THIRD_WRONG_ANSWER_CREATOR,
  BACK_TO_MAIN_MENU,
  BACK_TO_PREVIOUS_MENU,
  SAVE_QUESTION_CREATOR,
} from '../constants/buttons';
import {
  ADD_CORRECT_ANSWER_CREATOR_SCENE,
  ADD_FIRST_WRONG_ANSWER_CREATOR_SCENE,
  ADD_QUESTION_CREATOR_SCENE,
  ADD_QUESTION_SCENE,
  ADD_SECOND_WRONG_ANSWER_CREATOR_SCENE,
  ADD_THIRD_WRONG_ANSWER_CREATOR_SCENE,
  EDIT_QUESTIONS_SCENE,
  START_MAIN_SCENE,
} from '../constants/scenes';
import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';

import { ContextSceneType } from '../dto/types/context.type';
import { MS_DONE, MS_SORRY_ERROR } from '../constants/messages.const';
import { CreatorQuestion } from '../entities/question-creator.entity';
import { Question } from '../entities/question.entity';
import { CreatorQuestionService } from '../services/question.creator.service';
import { QuestionService } from '../services/question.service';
import { getMessageText } from '../utils/get-message-text';
import { getUserId } from '../utils/get-user-id';

@Scene(ADD_QUESTION_SCENE)
export class AddNewAQuestionScene {
  constructor(
    private readonly creatorQuestionService: CreatorQuestionService,
    private readonly questionService: QuestionService,
  ) {}

  @SceneEnter()
  async sceneEnter(@Ctx() ctx: ContextSceneType) {
    const creatorQ: CreatorQuestion | null =
      await this.creatorQuestionService.getByTelegramId(getUserId(ctx));

    if (creatorQ == null) {
      await ctx.reply('Давайте приступим,сэр: ', {
        reply_markup: {
          resize_keyboard: true,
          keyboard: [
            [{ text: ADD_QUESTION_CREATOR }],
            [{ text: BACK_TO_PREVIOUS_MENU }],
          ],
        },
      });
    } else if (creatorQ.correctAnswer === null) {
      await ctx.reply('2/5', {
        reply_markup: {
          resize_keyboard: true,
          keyboard: [
            [{ text: ADD_CORRECT_ANSWER_CREATOR }],
            [{ text: BACK_TO_PREVIOUS_MENU }],
          ],
        },
      });
    } else if (creatorQ.answer_1 === null) {
      await ctx.reply('3/5', {
        reply_markup: {
          resize_keyboard: true,
          keyboard: [
            [{ text: ADD_FIRST_WRONG_ANSWER_CREATOR }],
            [{ text: BACK_TO_PREVIOUS_MENU }],
          ],
        },
      });
    } else if (creatorQ.answer_2 === null) {
      await ctx.reply('4/5', {
        reply_markup: {
          resize_keyboard: true,
          keyboard: [
            [{ text: ADD_SECOND_WRONG_ANSWER_CREATOR }],
            [{ text: BACK_TO_PREVIOUS_MENU }],
          ],
        },
      });
    } else if (creatorQ.answer_3 === null) {
      await ctx.reply('5/5', {
        reply_markup: {
          resize_keyboard: true,
          keyboard: [
            [{ text: ADD_THIRD_WRONG_ANSWER_CREATOR }],
            [{ text: BACK_TO_PREVIOUS_MENU }],
          ],
        },
      });
    } else {
      await ctx.reply(showObjectLikeString(creatorQ), {
        reply_markup: {
          resize_keyboard: true,
          keyboard: [
            [{ text: ADD_QUESTION_CREATOR }],
            [{ text: ADD_CORRECT_ANSWER_CREATOR }],
            [{ text: ADD_FIRST_WRONG_ANSWER_CREATOR }],
            [{ text: ADD_SECOND_WRONG_ANSWER_CREATOR }],
            [{ text: ADD_THIRD_WRONG_ANSWER_CREATOR }],
            [{ text: SAVE_QUESTION_CREATOR }],
            [{ text: BACK_TO_PREVIOUS_MENU }],
            [{ text: BACK_TO_MAIN_MENU }],
          ],
        },
      });
    }
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
        await ctx.scene.enter(ADD_QUESTION_CREATOR_SCENE);
        break;
      case ADD_CORRECT_ANSWER_CREATOR:
        await ctx.scene.enter(ADD_CORRECT_ANSWER_CREATOR_SCENE);
        break;
      case ADD_FIRST_WRONG_ANSWER_CREATOR:
        await ctx.scene.enter(ADD_FIRST_WRONG_ANSWER_CREATOR_SCENE);
        break;
      case ADD_SECOND_WRONG_ANSWER_CREATOR:
        await ctx.scene.enter(ADD_SECOND_WRONG_ANSWER_CREATOR_SCENE);
        break;
      case ADD_THIRD_WRONG_ANSWER_CREATOR:
        await ctx.scene.enter(ADD_THIRD_WRONG_ANSWER_CREATOR_SCENE);
        break;
      case SAVE_QUESTION_CREATOR:
        {
          const creatorQ: CreatorQuestion | null =
            await this.creatorQuestionService.getByTelegramId(getUserId(ctx));
          const question: Question = await this.questionService.createByCreator(
            creatorQ,
          );

          if (
            question.body === creatorQ.body &&
            question.correctAnswer === creatorQ.correctAnswer &&
            question.answer_1 === creatorQ.answer_1 &&
            question.answer_2 === creatorQ.answer_2 &&
            question.answer_3 === creatorQ.answer_3
          ) {
            await this.creatorQuestionService.deleteByTelegramId(
              getUserId(ctx),
            );
            await ctx.reply(MS_DONE);
            ctx.scene.enter(EDIT_QUESTIONS_SCENE);
          } else {
            await ctx.reply(MS_SORRY_ERROR);
            await ctx.scene.enter(ADD_QUESTION_SCENE);
          }
        }
        break;
      default:
        await ctx.scene.enter(ADD_QUESTION_SCENE);
    }
  }
}
