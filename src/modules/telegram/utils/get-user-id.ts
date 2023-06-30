export const getUserId = (context): string => {
  if ('callback_query' in context.update) {
    return context.update.callback_query.from.id.toString();
  }

  if ('message' in context.update) {
    return context.update.message.from.id.toString();
  }

  if ('my_chat_member' in context.update) {
    return context.update.my_chat_member.from.id.toString();
  }

  return '-1';
};
