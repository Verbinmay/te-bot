export const showList = (todos) =>
  `Your list: \n\n${todos
    .map((todo) => (todo.isComplied ? '✅' : '🔘') + ' ' + todo.name + '\n\n')
    .join('')}`;

export function arrayQuestions(num: number) {
  const arrayOfQuestionNumbers: Array<string> = [];

  for (let i = 0; i < num; i++) {
    const createDiapason: string =
      i + 1 + '.' + ' ' + `${1 + i * 2}` + ' - ' + `${20 + i * 20}`;
    arrayOfQuestionNumbers.push(createDiapason);
  }
  return `you can choose: \n\n${arrayOfQuestionNumbers
    .map((d) => d + '\n\n')
    .join('')}`;
}

export function createWord(count: number): string {
  let Zadan: string;
  const helpNumber = count % 10;
  if (
    //ие
    count === 1 ||
    (helpNumber === 1 && count != 11)
  ) {
    Zadan = 'задание';
  } else if (
    //ий
    (count >= 5 && count <= 20) ||
    helpNumber === 0 ||
    (helpNumber >= 5 && helpNumber <= 9)
  ) {
    Zadan = 'заданий';
  } else {
    Zadan = 'задания';
  }
  return Zadan;
}
