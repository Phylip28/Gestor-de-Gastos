import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany, JoinTable, OneToMany, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Expense } from '../../expenses/entities/expense.entity';

@Entity('trips')
export class Trip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  currency: string;

  @Column({ unique: true })
  code: string;

  @ManyToOne(() => User)
  creator: User;

  @ManyToMany(() => User, user => user.trips)
  @JoinTable()
  participants: User[];

  @OneToMany(() => Expense, expense => expense.trip)
  expenses: Expense[];

  @CreateDateColumn()
  createdAt: Date;
}