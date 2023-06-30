/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ContextSceneType } from '../dto/types/context.type';

export const getMessageText = (ctx: ContextSceneType) => {
  // @ts-ignore
  return ctx.message.text;
};
