import {
  Action,
  Command,
  Ctx,
  GameQuery,
  Hears,
  InjectBot,
  InlineQuery,
  Message,
  On,
  Settings,
  Start,
  Update,
} from 'nestjs-telegraf';
import {
  SA_Auth,
  SA_Buttons,
  SA_adminOpen,
  SA_auth,
  actionButtons,
  answerButtons,
  getTwentyQuestions,
  readyButtons,
  startTwentyQuestions,
} from './app.buttons';
import { log } from 'console';
import { Telegraf, Telegram } from 'telegraf';
import { callbackQuery } from 'telegraf/filters';
import { MessageEntity } from 'telegraf/typings/core/types/typegram';
import { inlineKeyboard } from 'telegraf/typings/markup';

import { User } from './entities/user.entity';
// import { AppService } from './services/question.service';
import { UserService } from './services/user.service';
import { arrayQuestions, createWord, showList } from './app.utils';
import { Context } from './context.interface';
import { Message_, Message_Inline } from './type';

@Update()
export class AppUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    // private readonly appService: AppService,
    private readonly userService: UserService,
  ) {}

  @Start()
  async startCommand(ctx: Context) {
    await ctx.sendSticker(
      `https://tlgrm.eu/_/stickers/697/ba1/697ba160-9c77-3b1a-9d97-86a9ce75ff4d/51.webp`,
    );
    if (!ctx.session.userIdDB) {
      const userFromDb = await this.userService.create(ctx.from.id);

      ctx.session.userIdDB = userFromDb.id;
      await ctx.reply(
        `Привет, ${ctx.from.first_name}!\nЗдесь проходят тренировки для собеседований\nДавай потренеруемся 😤`,
        actionButtons(),
      );
      return;
    }
    await ctx.reply(
      `Привет, ${ctx.from.first_name}!\nДавай потренеруемся 😤`,
      actionButtons(),
    );
  }
  // That we marker in buttons file
  // Что бы работало @Action нужно использовать Markup.inlineKeyboard

  // Хороший пример. Но насколько я знаю Action для inlineButtons, а Hears для обычных и текста.
  // Если кнопки не инлайн , то нужно отслеживать текст или состояние.  А callback data только у инлайновых кнопках

  //TODO
  // @Hears(getTwentyQuestions)
  // async getTwentyQuestions(ctx: Context) {
  //   const questionCount: number = await this.appService.getCount();
  //   const packQuestionsCount = Math.floor(questionCount / 20);
  //   if (packQuestionsCount === 0) {
  //     await ctx.reply(`sorry we don't have questions`);
  //   } else {
  //     await ctx.reply(arrayQuestions(packQuestionsCount));
  //     ctx.session.type = 'startQuestion';
  //   }
  // }
  //TODO
  // @Hears(startTwentyQuestions)
  // async startTwentyQuestions(ctx: Context) {
  //   ctx.session.type = 'answers';
  //   const question = ctx.session.questions[0];

  //   await ctx.reply(showList(todos));
  // }

  @Hears(SA_adminOpen)
  async SA_adminOpen(ctx: Context) {
    await ctx.reply(
      'https://tlgrm.eu/_/stickers/697/ba1/697ba160-9c77-3b1a-9d97-86a9ce75ff4d/110.webp',
      SA_Auth(),
    );
  }
  @Action(SA_auth)
  async SA_auth(ctx: Context) {}
  // @Hears(myList)
  // async getAllTask(ctx: Context) {
  //   const todos = await this.appService.getAll();
  //   await ctx.reply(showList(todos));
  // }

  // @Hears(doneTask)
  // async doneTask(ctx: Context) {
  //   await ctx.reply('Напиши id задачи:');
  //   ctx.session.type = 'done';
  // }
  // @Hears(createTask)
  // async createTask(ctx: Context) {
  //   await ctx.reply('Напиши задачy:');
  //   ctx.session.type = 'create';
  // }
  // @Hears(deleteTask)
  // async deleteTask(ctx: Context) {
  //   await ctx.deleteMessage();
  //   await ctx.reply('Напиши id задачи:');
  //   ctx.session.type = 'remove';
  // }
  // @Hears(editTask)
  // async editTask(ctx: Context) {
  //   await ctx.deleteMessage();
  //   await ctx.replyWithHTML(
  //     'Напиши id задачи и новое название: \n\n' +
  //       'В формате - <b>1 | Новое название</b>',
  //   );
  //   ctx.session.type = 'edit';
  // }

  @Command(['info', 'stop'])
  async getQuit(@Message() message: Message_, @Ctx() ctx: Context) {
    if (message.text == '/info') {
      if (!ctx.session.userIdDB) {
        await ctx.reply(
          `Тебя зовут: ${ctx.from.first_name}!\nИграй и тут будут отображаться твои успехи!`,
        );
        return;
      }
      const user: User | null = await this.userService.getById(
        ctx.session.userIdDB,
      );
      if (!user) return new Error('Something wrong with user');

      const correctCount = user.answers.filter(
        (a) => a.answerStatus === 'Correct',
      ).length;
      const incorrectCount = user.answers.filter(
        (a) => a.answerStatus === 'Incorrect',
      ).length;
      const word_correct = createWord(correctCount);
      const word_incorrect = createWord(incorrectCount);
      await ctx.reply(
        `Тебя зовут: ${ctx.from.first_name}!\n\nТы правильно ответил на  ${correctCount}  ${word_correct}\n\nА неправильно ответил на  ${incorrectCount}  ${word_incorrect}`,
      );
    }

    if (message.text === '/stop') {
      await ctx.reply(`Я не умею останавливаться`);
    }
  }

  @On('callback_query')
  async getQuery(@Message() message: Message_, @Ctx() ctx: Context) {
    const a: any = ctx.callbackQuery;
    log(a, 'a');
    if (a.data === 'SA_auth') {
      const user: User | null = await this.userService.getById(
        ctx.session.userIdDB,
      );

      if (user.isAdmin === true && ctx.session.isAdmin) {
        ctx.session.type = 'admin';
        ctx.reply('Приятной работы, шеф 😼', SA_Buttons());
        return;
      }

      log('vvodi');
      ctx.session.type = 'SA_auth';
      return;
    }
  }

  @On('message')
  async getMessage(@Message() message: Message_, @Ctx() ctx: Context) {
    if (ctx.session.type === 'SA_auth') {
      const [a, b] = message.text.split('|');
      const login = a.trim();
      const password = b.trim();

      if (
        login === process.env.SA_LOGIN &&
        password === process.env.SA_PASSWORD
      ) {
        const user: User | null = await this.userService.hiAdmin(
          ctx.session.userIdDB,
        );
        if (!user) {
          return new Error();
        }
        ctx.session.isAdmin = true;
        ctx.deleteMessage();
        ctx.session.type = 'admin';
        ctx.replyWithSticker(
          'https://tlgrm.eu/_/stickers/697/ba1/697ba160-9c77-3b1a-9d97-86a9ce75ff4d/61.webp',
        );
        ctx.reply('Успешной работы, господин', SA_Buttons());
        return;
      }
    }
    // if (ctx.session.type === 'done') {
    //   const todo: Array<TaskEntity> = await this.appService.doneTask(
    //     Number(message),
    //   );
    //   if (!todo) {
    //     ctx.deleteMessage();
    //     ctx.reply('no task with this id');
    //     return;
    //   }
    //   await ctx.reply(showList(todo));
    // }
    // if (ctx.session.type === 'create') {
    //   const task = new TaskEntity();
    //   task.name = message;
    //   const savedTask: Array<TaskEntity> = await this.appService.create(task);
    //   ctx.deleteMessage();
    //   await ctx.reply(showList(savedTask));
    // }
    // if (ctx.session.type === 'remove') {
    //   const deletedResult: Array<TaskEntity> | false =
    //     await this.appService.deleteTask(Number(message));
    //   if (deletedResult === false) {
    //     ctx.deleteMessage();
    //     ctx.reply('no task with this id');
    //     return;
    //   }
    //   await ctx.reply(showList(deletedResult));
    // }
    // if (ctx.session.type === 'edit') {
    //   const [taskId, taskName] = message.split(' | ');
    //   const todo: Array<TaskEntity> = await this.appService.editTask(
    //     Number(taskId),
    //     taskName,
    //   );
    //   if (!todo) {
    //     ctx.deleteMessage();
    //     ctx.reply('no task with this id');
    //     return;
    //   }
    //   await ctx.reply(showList(todo));
    // }

    //TODO
    if (ctx.session.type === 'startQuestion') {
      //   let a: number;
      //   try {
      //     a = Number(message.text);
      //   } catch (error) {
      //     ctx.reply('please, use number');
      //     return;
      //   }
      //   const questionCount: number = await this.appService.getCount();
      //   if (a > questionCount) {
      //     ctx.reply('no question group with this id');
      //     return;
      //   }
      //TODO
      // const questions: Array<TaskEntity> =
      //   await this.appService.getAllWithPagination(a);
      // ctx.session.questions = questions;

      // await ctx.reply(questions.map((o) => o.name + '\n\n').join(' '));

      // ctx.reply(
      //   ctx.session.questions[0].name,
      //   answerButtons('1', '2', '3', '4'),
      // );
      ctx.replyWithSticker(
        'https://tlgrm.eu/_/stickers/697/ba1/697ba160-9c77-3b1a-9d97-86a9ce75ff4d/59.webp',
        readyButtons(),
      );

      return;
    }

    await ctx.reply('Я ничего не понял!');
    await ctx.sendSticker(
      'https://tlgrm.eu/_/stickers/697/ba1/697ba160-9c77-3b1a-9d97-86a9ce75ff4d/12.webp',
    );
  }
}

// function CreateQuestion(ctx: Context) {

// }
