import { Markup } from 'telegraf';

export const myList = 'Список дел';
export const editTask = 'Отредактировать';
export const deleteTask = 'Удалить';
export const doneTask = 'Выполнить';
export const createTask = 'Создать';

export function actionButtons() {
  return Markup.keyboard(
    [
      Markup.button.callback(myList, 'list'),
      Markup.button.callback(editTask, 'edit'),
      Markup.button.callback(deleteTask, 'delete'),
      Markup.button.callback(doneTask, 'done'),
      Markup.button.callback(createTask, 'create'),
    ],
    {
      columns: 2,
    },
  );

  //** Так пишутся инлайновые кнопки */
  //   return Markup.inlineKeyboard([
  //     Markup.button.callback('Список дел', 'list'),
  //     Markup.button.callback('Отредактировать', 'edit'),
  //     Markup.button.callback('Удалить', 'delete'),
  //   ]);
}
