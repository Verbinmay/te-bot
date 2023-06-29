import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Question {
  @PrimaryGeneratedColumn('increment')
  public id!: number;

  @Column({ length: 500 })
  public name: string;

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

  @Column({ type: 'boolean', default: false })
  public isPublished = true;
}
