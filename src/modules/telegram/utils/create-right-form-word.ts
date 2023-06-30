export const createWord = (count: number): string => {
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
};
