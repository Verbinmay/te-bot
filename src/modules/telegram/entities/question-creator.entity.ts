import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CreatorQuestion {
  @PrimaryGeneratedColumn('increment')
  public id!: number;

  @Column()
  public telegramId: string;
  @Column('text')
  public body: string;

  @Column('text', { nullable: true })
  public correctAnswer: string | null = null;

  @Column('text', { nullable: true })
  public answer_1: string | null = null;
  @Column('text', { nullable: true })
  public answer_2: string | null = null;
  @Column('text', { nullable: true })
  public answer_3: string | null = null;
}
