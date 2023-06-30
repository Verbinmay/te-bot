import { Markup } from 'telegraf';

// export const myList = 'Список дел';
// export const editTask = 'Отредактировать';
// export const deleteTask = 'Удалить';
// export const doneTask = 'Выполнить';
export const SA_createQuestion = 'Создать вопрос';
export const SA_adminOpen = 'Админ';
export const SA_auth = 'Введи логин и пароль через | ';
export const getTwentyQuestions = 'Ответить на 20 вопросов 🧐';
export const startTwentyQuestions = 'Погнали 💪🏻';
export const brakeTwentyQuestions = 'Не готов 🏃🏻';

export function actionButtons() {
  return Markup.keyboard(
    [
      // Markup.button.callback(myList, 'list'),
      // Markup.button.callback(editTask, 'edit'),
      // Markup.button.callback(deleteTask, 'delete'),
      // Markup.button.callback(doneTask, 'done'),
      Markup.button.callback(SA_adminOpen, 'SA_adminOpen'),
      //TODO Markup.button.callback(getTwentyQuestions, 'getTwentyQuestions'),
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
export function readyButtons() {
  return Markup.keyboard(
    [
      Markup.button.callback(startTwentyQuestions, 'startTwentyQuestions'),
      Markup.button.callback(brakeTwentyQuestions, 'brakeTwentyQuestions'),
    ],
    {
      columns: 2,
    },
  );
}

export function SA_Buttons() {
  return Markup.keyboard(
    [
      Markup.button.callback(SA_createQuestion, 'SA_createQuestion'),

      // Markup.button.callback(brakeTwentyQuestions, 'brakeTwentyQuestions'),
    ],
    {
      columns: 2,
    },
  );
}
export function SA_Auth() {
  return Markup.inlineKeyboard([
    Markup.button.callback(SA_auth, 'SA_auth'),
    Markup.button.callback('kkkkkkk', 'kkkkkkk'),
  ]);
}

export function answerButtons(a: string, b: string, c: string, d: string) {
  return Markup.inlineKeyboard(
    [
      Markup.button.callback(a, 'a'),
      Markup.button.callback(b, 'b'),
      Markup.button.callback(c, 'c'),
      Markup.button.callback(d, 'd'),
    ],
    {
      columns: 2,
    },
  );
}
