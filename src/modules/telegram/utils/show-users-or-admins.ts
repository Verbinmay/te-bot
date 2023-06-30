const showArrayOfObjects = (objects) => {
  let result = '';
  objects.forEach((obj, index) => {
    result += `${obj.role} ${index + 1}:\n`;
    Object.entries(obj).forEach(([key, value]) => {
      result += `  ${key}: ${value}\n`;
    });
    result += '\n';
  });

  return result;
};
