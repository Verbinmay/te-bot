export const showList = (todos) =>
  `Your list: \n\n${todos
    .map((todo) => (todo.isComplied ? '✅' : '🔘') + ' ' + todo.name + '\n\n')
    .join('')}`;
