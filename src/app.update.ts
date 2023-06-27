import {
  Action,
  Ctx,
  Hears,
  InjectBot,
  Message,
  On,
  Start,
  Update,
} from 'nestjs-telegraf';
import {
  actionButtons,
  createTask,
  deleteTask,
  doneTask,
  editTask,
  myList,
} from './app.buttons';
import { Telegraf } from 'telegraf';

import { AppService } from './app.service';
import { showList } from './app.utils';
import { Context } from './context.interface';
import { TaskEntity } from './task.entity';

@Update()
export class AppUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly appService: AppService,
  ) {}

  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply('Hi, friend 😸');
    await ctx.reply('Что ты хочешь сделать?', actionButtons());
  }
  //That we marker in buttons file
  //Что бы работало @Action нужно использовать Markup.inlineKeyboard

  //Хороший пример. Но насколько я знаю Action для inlineButtons, а Hears для обычных и текста.
  //Если кнопки не инлайн , то нужно отслеживать текст или состояние.  А callback data только у инлайновых кнопках

  @Hears(myList)
  async getAllTask(ctx: Context) {
    const todos = await this.appService.getAll();
    await ctx.reply(showList(todos));
  }

  @Hears(doneTask)
  async doneTask(ctx: Context) {
    await ctx.reply('Напиши id задачи:');
    ctx.session.type = 'done';
  }
  @Hears(createTask)
  async createTask(ctx: Context) {
    await ctx.reply('Напиши задачy:');
    ctx.session.type = 'create';
  }
  @Hears(deleteTask)
  async deleteTask(ctx: Context) {
    await ctx.deleteMessage();
    await ctx.reply('Напиши id задачи:');
    ctx.session.type = 'remove';
  }
  @Hears(editTask)
  async editTask(ctx: Context) {
    await ctx.deleteMessage();
    await ctx.replyWithHTML(
      'Напиши id задачи и новое название: \n\n' +
        'В формате - <b>1 | Новое название</b>',
    );
    ctx.session.type = 'edit';
  }

  @On('text')
  async getMessage(@Message('text') message: string, @Ctx() ctx: Context) {
    if (!ctx.session.type) return;

    if (ctx.session.type === 'done') {
      const todo: Array<TaskEntity> = await this.appService.doneTask(
        Number(message),
      );

      if (!todo) {
        ctx.deleteMessage();
        ctx.reply('no task with this id');
        return;
      }

      await ctx.reply(showList(todo));
    }

    if (ctx.session.type === 'create') {
      const task = new TaskEntity();
      task.name = message;
      const savedTask: Array<TaskEntity> = await this.appService.create(task);

      ctx.deleteMessage();

      await ctx.reply(showList(savedTask));
    }

    if (ctx.session.type === 'remove') {
      const deletedResult: Array<TaskEntity> | false =
        await this.appService.deleteTask(Number(message));
      if (deletedResult === false) {
        ctx.deleteMessage();
        ctx.reply('no task with this id');
        return;
      }

      await ctx.reply(showList(deletedResult));
    }

    if (ctx.session.type === 'edit') {
      const [taskId, taskName] = message.split(' | ');

      const todo: Array<TaskEntity> = await this.appService.editTask(
        Number(taskId),
        taskName,
      );
      if (!todo) {
        ctx.deleteMessage();
        ctx.reply('no task with this id');
        return;
      }

      await ctx.reply(showList(todo));
    }
  }
}
