import { TelegrafModule } from 'nestjs-telegraf';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AddFirstWrongAnswerCreatorScene } from './modules/telegram/scenes/admin/question/creator/creator-1-wrong-answer.scene';
import { AddSecondWrongAnswerCreatorScene } from './modules/telegram/scenes/admin/question/creator/creator-2-wrong-answer.scene';
import { AddThirdWrongAnswerCreatorScene } from './modules/telegram/scenes/admin/question/creator/creator-3-wrong-answer.scene';
import { AddCorrectAnswerCreatorScene } from './modules/telegram/scenes/admin/question/creator/creator-correct-answer.scene';
import { CreatorQuestionsScene } from './modules/telegram/scenes/admin/question/creator/creator-questions.scene';
import { Q_ChangeFirstAnswerScene } from './modules/telegram/scenes/admin/question/update/change-1-answer.scene';
import { Q_ChangeSecondAnswerScene } from './modules/telegram/scenes/admin/question/update/change-2-answer.scene';
import { Q_ChangeThirdAnswerScene } from './modules/telegram/scenes/admin/question/update/change-3-answer.scene';
import { Q_ChangeCorrectAnswerScene } from './modules/telegram/scenes/admin/question/update/change-correct-answer.scene';
import { Q_ChangeQuestionScene } from './modules/telegram/scenes/admin/question/update/change-question.scene';
import { AddNewAdministratorScene } from './modules/telegram/scenes/admin/administrator/add-new-administrator.scene';
import { RemoveAdministratorScene } from './modules/telegram/scenes/admin/administrator/remove-administrator.scene';
import { AddNewAQuestionScene } from './modules/telegram/scenes/admin/question/add-new-question.scene';
import { DeleteQuestionScene } from './modules/telegram/scenes/admin/question/delete-question.scene';
import { ExelNewQuestionScene } from './modules/telegram/scenes/admin/question/exel-new-questions.scene';
import { UpdateQuestionScene } from './modules/telegram/scenes/admin/question/update-question.scene';
import { BanUserScene } from './modules/telegram/scenes/admin/user/ban-user.scene';
import { UnBanUserScene } from './modules/telegram/scenes/admin/user/unban-user.scene';
import { EditAdministratorsScene } from './modules/telegram/scenes/admin/edit-administrators.scene';
import { EditQuestionsScene } from './modules/telegram/scenes/admin/edit-questions.scene';
import { EditUsersScene } from './modules/telegram/scenes/admin/edit-users.scene';
import { CallAdministratorScene } from './modules/telegram/scenes/helpers/call-administrator.scene';
import { InterviewQuestionsScene } from './modules/telegram/scenes/interview/question-interview.scene';
import { QuickQuestionsScene } from './modules/telegram/scenes/quiz/question-quiz.scene';
import { Answer } from './modules/telegram/entities/answer.entity';
import { CreatorQuestion } from './modules/telegram/entities/question-creator.entity';
import { Question } from './modules/telegram/entities/question.entity';
import { User } from './modules/telegram/entities/user.entity';
import { sessionMiddleware } from './modules/telegram/middlewares/session.middleware';
import { GetInfoStartScene } from './modules/telegram/scenes/about-me-start.scene';
import { AdministrationStartScene } from './modules/telegram/scenes/administration-start.scene';
import { AuthorizationScene } from './modules/telegram/scenes/authorization.scene';
import { HelpersStartScene } from './modules/telegram/scenes/helpers-start.scene';
import { InterviewStartScene } from './modules/telegram/scenes/interview-questions-start.scene';
import { MainScene } from './modules/telegram/scenes/main.scene';
import { QuizStartScene } from './modules/telegram/scenes/quick-questions-start.scene';
import { WhatICanScene } from './modules/telegram/scenes/what-i-can.scene';
import { WrongAnswersStartScene } from './modules/telegram/scenes/wrong-answers-start.scene';
import { AnswerService } from './modules/telegram/services/answer.service';
import { ErrorService } from './modules/telegram/services/error.service';
import { CreatorQuestionService } from './modules/telegram/services/question.creator.service';
import { QuestionService } from './modules/telegram/services/question.service';
import { UserService } from './modules/telegram/services/user.service';
import { TelegramUpdate } from './modules/telegram/telegram.update';
import { AppController } from './app.controller';

export const entities = [User, Answer, Question, CreatorQuestion];

const services = [
  AnswerService,
  CreatorQuestionService,
  ErrorService,
  QuestionService,
  TelegramUpdate,
  UserService,
];

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
  WhatICanScene,
  WrongAnswersStartScene,
];

@Module({
  imports: [
    ConfigModule.forRoot(),
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        token: configService.get<string>('TOKEN'),
        ...FuncByTelegramModule(configService),
        middlewares: [sessionMiddleware],
      }),
    }),
    //forRootAsync данные из конфиг сервиса
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        ...FuncByTypeOrmModule(configService),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        ssl: configService.get('CON') !== 'dev' ? true : false,
        entities: [...entities],
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Answer, Question, CreatorQuestion]),
  ],
  controllers: [AppController],
  providers: [...scenes, ...services],
})
export class AppModule {}

function FuncByTypeOrmModule(configService: ConfigService) {
  if (configService.get('CON') === 'dev') {
    return {
      host: configService.get('DB_HOST'),
      port: +configService.get<number>('DB_PORT'),
    };
  } else {
    return {
      url: configService.get('DB_URL'),
    };
  }
}

function FuncByTelegramModule(configService: ConfigService) {
  if (configService.get('CON') !== 'dev') {
    return {
      launchOptions: {
        webhook: {
          domain: configService.get('DOMAIN'),
          hookPath: '/telegram',
        },
      },
    };
  } else {
    return {};
  }
}
