import { Markup } from 'telegraf';

// export const showDiapasonQuestions = (num: number) => {
//   const arrayOfQuestionNumbers: Array<string> = [];

//   for (let i = 0; i < num; i++) {
//     const createDiapason: string =
//       i + 1 + '.' + ' ' + `${1 + i * 2}` + ' - ' + `${20 + i * 20}`;
//     arrayOfQuestionNumbers.push(createDiapason);
//   }
//   return `you can choose: \n\n${arrayOfQuestionNumbers
//     .map((d) => d + '\n\n')
//     .join('')}`;
// };
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
