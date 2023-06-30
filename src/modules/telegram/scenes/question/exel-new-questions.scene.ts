import {
  BACK_TO_MAIN_MENU,
  BACK_TO_PREVIOUS_MENU,
} from '../../constants/buttons';
import {
  ADD_QUESTION_SCENE,
  EDIT_QUESTIONS_SCENE,
  EXEL_QUESTION_SCENE,
  START_MAIN_SCENE,
} from '../../constants/scenes';
import {
  MS_EXEL_DONE,
  MS_EXEL_MESSAGE,
  MS_SORRY_ERROR,
} from '../../constants/messages.const';
import axios from 'axios';
import * as fs from 'fs';
import { promises as fsPromises } from 'fs';
import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import * as path from 'path';
import * as xlsx from 'xlsx';

import { ContextSceneType } from '../../dto/types/context.type';
import { Question } from '../../entities/question.entity';
import { QuestionService } from '../../services/question.service';
import { getMessageText } from '../../utils/get-message-text';

@Scene(EXEL_QUESTION_SCENE)
export class ExelNewQuestionScene {
  constructor(private readonly questionService: QuestionService) {}

  @SceneEnter()
  async sceneEnter(@Ctx() ctx: ContextSceneType) {
    const fileStream = fs.createReadStream('exel.xlsx');

    await ctx.replyWithDocument({ source: fileStream, filename: 'exel.xlsx' });
    await ctx.reply(MS_EXEL_MESSAGE, {
      reply_markup: {
        resize_keyboard: true,
        keyboard: [
          [{ text: BACK_TO_PREVIOUS_MENU }],
          [{ text: BACK_TO_MAIN_MENU }],
        ],
      },
    });
  }

  @On('document')
  async onDocument(@Ctx() ctx: ContextSceneType) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const document = ctx.message.document;
    const fileId = document.file_id;
    if (
      document.mime_type ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      const fileLink = await ctx.telegram.getFileLink(fileId);
      const response = await axios.get(fileLink.toString(), {
        responseType: 'arraybuffer',
      });
      const fileBuffer = response.data;

      // Сохраняем файл на диске
      const fileName = 'exel.xlsx';
      const currentFilePath = __filename;
      const currentDir = path.dirname(currentFilePath);
      const filePath = path.join(currentDir, '..', 'data', fileName);
      await fsPromises.writeFile(filePath, fileBuffer);

      // Читаем файл с помощью xlsx.read()
      const workbook = xlsx.read(fileBuffer, { type: 'buffer' });

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const range = xlsx.utils.decode_range(worksheet['!ref']);

      let errorCounter = 0;
      for (let row = range.s.r; row <= range.e.r; row++) {
        const data = [];
        for (let col = range.s.c; col <= range.e.c; col++) {
          const cell = worksheet[xlsx.utils.encode_cell({ r: row, c: col })];
          data.push(cell.v);
        }
        try {
          const newQuestion = new Question();
          newQuestion.body = data[0].toString();
          newQuestion.correctAnswer = data[1].toString();
          newQuestion.answer_1 = data[2].toString();
          newQuestion.answer_2 = data[3].toString();
          newQuestion.answer_3 = data[4].toString();
          await this.questionService.create(newQuestion);
        } catch (error) {
          errorCounter++;
          await ctx.reply(`${MS_SORRY_ERROR}: ${data.join('|')}`);
        }
      }
      await ctx.reply(MS_EXEL_DONE);
      if (errorCounter !== 0) await ctx.reply(`Были ошибки :${errorCounter}`);
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
      default:
        await ctx.scene.enter(EXEL_QUESTION_SCENE);
    }
  }
}
