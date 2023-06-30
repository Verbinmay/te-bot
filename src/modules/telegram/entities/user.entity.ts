import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Roles } from '../dto/user/create-user.dto';
import { Answer } from './answer.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public telegramId: string;

  @Column()
  public userName: string;

  @Column()
  public firstName: string;

  @Column()
  public lastName: string;

  @Column({ type: 'enum', enum: ['admin', 'user'] })
  public role: Roles;

  @OneToMany(() => Answer, (answer) => answer.user)
  public answers: Array<Answer>;

  @Column('simple-json', { nullable: true })
  public questionTwenty: Array<object>;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ nullable: true, type: 'timestamp' })
  public updatedAt: Date | null = null;
}
