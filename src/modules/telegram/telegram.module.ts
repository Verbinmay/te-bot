import { entities } from 'src/app.module';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { Q_ChangeFirstAnswerScene } from './scenes/question/update/change-1-answer.scene';
import { Q_ChangeSecondAnswerScene } from './scenes/question/update/change-2-answer.scene';
import { Q_ChangeThirdAnswerScene } from './scenes/question/update/change-3-answer.scene';
import { Q_ChangeCorrectAnswerScene } from './scenes/question/update/change-correct-answer.scene';
import { Q_ChangeQuestionScene } from './scenes/question/update/change-question.scene';
import { AddFirstWrongAnswerCreatorScene } from './scenes/creator/creator-1-wrong-answer.scene';
import { AddSecondWrongAnswerCreatorScene } from './scenes/creator/creator-2-wrong-answer.scene';
import { AddThirdWrongAnswerCreatorScene } from './scenes/creator/creator-3-wrong-answer.scene';
import { AddCorrectAnswerCreatorScene } from './scenes/creator/creator-correct-answer.scene';
import { CreatorQuestionsScene } from './scenes/creator/creator-questions.scene';
import { AddNewAQuestionScene } from './scenes/question/add-new-question.scene';
import { DeleteQuestionScene } from './scenes/question/delete-question.scene';
import { UpdateQuestionScene } from './scenes/question/update-question.scene';
import { BanUserScene } from './scenes/user/ban-user.scene';
import {} from './constants/scenes';
import { Answer } from './entities/answer.entity';
import { CreatorQuestion } from './entities/question-creator.entity';
import { Question } from './entities/question.entity';
import { User } from './entities/user.entity';
import { AddNewAdministratorScene } from './scenes/add-new-administrator.scene';
import { AdministrationStartScene } from './scenes/administration-start.scene';
import { AuthorizationScene } from './scenes/authorization.scene';
import { EditAdministratorsScene } from './scenes/edit-administrators.scene';
import { EditQuestionsScene } from './scenes/edit-questions.scene';
import { EditUsersScene } from './scenes/edit-users.scene';
import { MainScene } from './scenes/main.scene';
import { RemoveAdministratorScene } from './scenes/remove-administrator.scene';
import { AnswerService } from './services/answer.service';
import { CreatorQuestionService } from './services/question.creator.service';
import { QuestionService } from './services/question.service';
import { UserService } from './services/user.service';
import { TelegramUpdate } from './telegram.update';

/**сцены */
const scenes = [
  AddFirstWrongAnswerCreatorScene,
  AddSecondWrongAnswerCreatorScene,
  AddThirdWrongAnswerCreatorScene,
  AddCorrectAnswerCreatorScene,
  CreatorQuestionsScene,
  AddNewAdministratorScene,
  AddNewAQuestionScene,
  AdministrationStartScene,
  AuthorizationScene,
  EditAdministratorsScene,
  EditQuestionsScene,
  MainScene,
  RemoveAdministratorScene,
  DeleteQuestionScene,
  UpdateQuestionScene,
  Q_ChangeQuestionScene,
  Q_ChangeCorrectAnswerScene,
  Q_ChangeFirstAnswerScene,
  Q_ChangeSecondAnswerScene,
  Q_ChangeThirdAnswerScene,
  EditUsersScene,
  BanUserScene,
];

/** сервисы */
const services = [
  TelegramUpdate,
  AnswerService,
  CreatorQuestionService,
  QuestionService,
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
