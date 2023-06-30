export const showObjectLikeString = (objects) => {
  let result = '';
  Object.entries(objects).forEach(([key, value]) => {
    result += `  ${key}: ${value}\n`;
  });
  result += '\n';

  return result;
};
