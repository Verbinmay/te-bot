export type CreateAnswerDto = {
  userIdFromDb: string;
  questionId: number;
  answerStatus: answerStatus;
  correctAnswer: string | null;
  wrongAnswer: string | null;
};

export type answerStatus = 'Correct' | 'Incorrect';
