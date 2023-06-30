/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ContextSceneType } from '../dto/types/context.type';

export const getUserFromSceneState = (ctx: ContextSceneType) => {
  // @ts-ignore
  return ctx.scene.state.user;
};
