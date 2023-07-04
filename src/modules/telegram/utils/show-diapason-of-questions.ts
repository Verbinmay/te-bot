import { Markup } from 'telegraf';

export const showDiapasonQuestions = (num: number) => {
  const arrayOfQuestionNumbers: Array<any> = [];

  for (let i = 0; i < num; i++) {
    const createDiapason: string = `${i * 20 + 1}` + ' - ' + `${i * 20 + 20}`;

    arrayOfQuestionNumbers.push(Markup.button.callback(createDiapason, `${i}`));
  }
  return Markup.inlineKeyboard(arrayOfQuestionNumbers, {
    columns: 3,
  });
};
