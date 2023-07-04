import { answerStatus } from './create-answer-dto';
import { ViewAnswerQuizDto } from './view-answer-quiz-dto';

export class ViewAnswerStateDto extends ViewAnswerQuizDto {
  answerStatus: answerStatus;
}
