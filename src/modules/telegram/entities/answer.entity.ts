import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { answerStatus } from 'src/modules/telegram/dto/answer/create-answer-dto';

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

  @Column()
  public questionId: number;

  @Column({ type: 'enum', enum: ['Correct', 'Incorrect'] })
  public answerStatus: answerStatus;

  @Column('text', { nullable: true, default: null })
  public correctAnswer: string;
  @Column('text', { nullable: true, default: null })
  public wrongAnswer: string;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ nullable: true, type: 'timestamp' })
  public updatedAt: Date | null = null;
}
