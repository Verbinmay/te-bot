import { answerStatus } from './create-answer-dto';

export type ViewAnswerStateDto = {
  questionId: number;
  question: string;
  correctAnswer: string;
  yourAnswer: string;
  answerStatus: answerStatus;
};
