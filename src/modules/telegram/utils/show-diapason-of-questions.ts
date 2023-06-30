export const showDiapasonQuestions = (num: number) => {
  const arrayOfQuestionNumbers: Array<string> = [];

  for (let i = 0; i < num; i++) {
    const createDiapason: string =
      i + 1 + '.' + ' ' + `${1 + i * 2}` + ' - ' + `${20 + i * 20}`;
    arrayOfQuestionNumbers.push(createDiapason);
  }
  return `you can choose: \n\n${arrayOfQuestionNumbers
    .map((d) => d + '\n\n')
    .join('')}`;
};
