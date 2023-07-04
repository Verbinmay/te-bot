import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { AddFirstWrongAnswerCreatorScene } from './scenes/admin/question/creator/creator-1-wrong-answer.scene';
import { AddSecondWrongAnswerCreatorScene } from './scenes/admin/question/creator/creator-2-wrong-answer.scene';
import { AddThirdWrongAnswerCreatorScene } from './scenes/admin/question/creator/creator-3-wrong-answer.scene';
import { AddCorrectAnswerCreatorScene } from './scenes/admin/question/creator/creator-correct-answer.scene';
import { CreatorQuestionsScene } from './scenes/admin/question/creator/creator-questions.scene';
import { Q_ChangeFirstAnswerScene } from './scenes/admin/question/update/change-1-answer.scene';
import { Q_ChangeSecondAnswerScene } from './scenes/admin/question/update/change-2-answer.scene';
import { Q_ChangeThirdAnswerScene } from './scenes/admin/question/update/change-3-answer.scene';
import { Q_ChangeCorrectAnswerScene } from './scenes/admin/question/update/change-correct-answer.scene';
import { Q_ChangeQuestionScene } from './scenes/admin/question/update/change-question.scene';
import { AddNewAdministratorScene } from './scenes/admin/administrator/add-new-administrator.scene';
import { RemoveAdministratorScene } from './scenes/admin/administrator/remove-administrator.scene';
import { AddNewAQuestionScene } from './scenes/admin/question/add-new-question.scene';
import { DeleteQuestionScene } from './scenes/admin/question/delete-question.scene';
import { ExelNewQuestionScene } from './scenes/admin/question/exel-new-questions.scene';
import { UpdateQuestionScene } from './scenes/admin/question/update-question.scene';
import { BanUserScene } from './scenes/admin/user/ban-user.scene';
import { UnBanUserScene } from './scenes/admin/user/unban-user.scene';
import { EditAdministratorsScene } from './scenes/admin/edit-administrators.scene';
import { EditQuestionsScene } from './scenes/admin/edit-questions.scene';
import { EditUsersScene } from './scenes/admin/edit-users.scene';
import { CallAdministratorScene } from './scenes/helpers/call-administrator.scene';
import { InterviewQuestionsScene } from './scenes/interview/question-interview.scene';
import { QuickQuestionsScene } from './scenes/quiz/question-quiz.scene';
import {} from './constants/scenes';
import { Answer } from './entities/answer.entity';
import { CreatorQuestion } from './entities/question-creator.entity';
import { Question } from './entities/question.entity';
import { User } from './entities/user.entity';
import { GetInfoStartScene } from './scenes/about-me-start.scene';
import { AdministrationStartScene } from './scenes/administration-start.scene';
import { AuthorizationScene } from './scenes/authorization.scene';
import { HelpersStartScene } from './scenes/helpers-start.scene';
import { InterviewStartScene } from './scenes/interview-questions-start.scene';
import { MainScene } from './scenes/main.scene';
import { QuizStartScene } from './scenes/quick-questions-start.scene';
import { WrongAnswersStartScene } from './scenes/wrong-answers-start.scene';
import { AnswerService } from './services/answer.service';
import { ErrorService } from './services/error.service';
import { CreatorQuestionService } from './services/question.creator.service';
import { QuestionService } from './services/question.service';
import { UserService } from './services/user.service';
import { TelegramUpdate } from './telegram.update';

/**сцены */
const scenes = [
  AddCorrectAnswerCreatorScene,
  AddFirstWrongAnswerCreatorScene,
  AddNewAQuestionScene,
  AddNewAdministratorScene,
  AddSecondWrongAnswerCreatorScene,
  AddThirdWrongAnswerCreatorScene,
  AdministrationStartScene,
  AuthorizationScene,
  BanUserScene,
  CallAdministratorScene,
  CreatorQuestionsScene,
  DeleteQuestionScene,
  EditAdministratorsScene,
  EditQuestionsScene,
  EditUsersScene,
  ExelNewQuestionScene,
  GetInfoStartScene,
  HelpersStartScene,
  InterviewQuestionsScene,
  InterviewStartScene,
  MainScene,
  Q_ChangeCorrectAnswerScene,
  Q_ChangeFirstAnswerScene,
  Q_ChangeQuestionScene,
  Q_ChangeSecondAnswerScene,
  Q_ChangeThirdAnswerScene,
  QuickQuestionsScene,
  QuizStartScene,
  RemoveAdministratorScene,
  UnBanUserScene,
  UpdateQuestionScene,
  WrongAnswersStartScene,
];

/** сервисы */
const services = [
  AnswerService,
  CreatorQuestionService,
  ErrorService,
  QuestionService,
  TelegramUpdate,
  UserService,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Answer, Question, CreatorQuestion]),
    /**
    Экспортирует HttpModule класс HttpService, который предоставляет методы на основе Axios для выполнения HTTP-запросов. Библиотека также преобразует полученные ответы HTTP в файлы Observables
     * 
     *   findAll(): Observable<AxiosResponse<Cat[]>> {
    return this.httpService.get('http://localhost:3000/cats');
  } */
    HttpModule,
  ],
  providers: [...scenes, ...services],
})
export class TelegramModule {}
