import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { answerStatus } from 'src/modules/telegram/dto/answer/create-answer-dto';

import { Question } from './question.entity';
import { User } from './user.entity';

@Entity()
export class Answer {
  @PrimaryGeneratedColumn('increment')
  public id!: number;

  @ManyToOne(() => User, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  public user: User;

  @ManyToOne(() => Question, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  public question: Question;

  @Column({ type: 'enum', enum: ['Correct', 'Incorrect'] })
  public answerStatus: answerStatus;

  @Column('text', { nullable: true, default: null })
  public body: string;

  @Column()
  public createdAt: string = new Date().toISOString();
}
