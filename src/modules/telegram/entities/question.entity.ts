import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Answer } from './answer.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn('increment')
  public id!: number;

  @OneToMany(() => Answer, (answer) => answer.question)
  public answers: Array<Answer>;

  @Column('text')
  public body: string;

  @Column('text')
  public correctAnswer: string;

  @Column('text')
  public answer_1: string;
  @Column('text')
  public answer_2: string;
  @Column('text')
  public answer_3: string;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ nullable: true, type: 'timestamp' })
  public updatedAt: Date | null = null;

  @Column({ type: 'boolean', default: true })
  public isPublished = true;
}
