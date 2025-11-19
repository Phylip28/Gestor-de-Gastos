import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Trip } from '../../trips/entities/trip.entity';
import { User } from '../../users/entities/user.entity';

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @ManyToOne(() => User)
  payer: User;

  @ManyToMany(() => User)
  @JoinTable()
  sharedWith: User[];

  @ManyToOne(() => Trip, trip => trip.expenses)
  trip: Trip;

  @CreateDateColumn()
  createdAt: Date;
}