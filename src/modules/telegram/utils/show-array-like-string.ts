export const showArrayOfObjectsLikeString = (objects: Array<any>) => {
  let result = '';
  objects.forEach((obj) => {
    Object.entries(obj).forEach(([key, value]) => {
      result += `  ${key}: ${value}\n`;
    });
    result += '\n';
  });

  return result;
};
