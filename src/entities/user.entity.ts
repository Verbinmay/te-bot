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
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public tgUserId: number;

  @OneToMany(() => Answer, (answer) => answer.user)
  public answers: Array<Answer>;

  @Column('simple-json', { nullable: true })
  public questionTwenty: Array<object>;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ nullable: true, type: 'timestamp' })
  public updatedAt: Date | null = null;

  @Column('boolean', { default: false })
  public isAdmin = false;
}
