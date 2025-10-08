import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Trip } from '../../trips/entities/trip.entity';
import { User } from '../../users/entities/user.entity';

// Entidad que representa un gasto compartido registrado en un viaje en la base de datos
@Entity('expenses')
export class Expense {
  // Identificador único del gasto generado automáticamente como UUID
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Título descriptivo del gasto que indica en qué se gastó el dinero
  @Column()
  title: string;

  // Monto total del gasto almacenado con precisión decimal de 10 dígitos y 2 decimales
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  // Relación muchos a uno con el usuario que realizó el pago del gasto
  @ManyToOne(() => User)
  payer: User;

  // Relación muchos a muchos con los usuarios que comparten el costo del gasto
  @ManyToMany(() => User)
  @JoinTable()
  sharedWith: User[];

  // Relación muchos a uno con el viaje al que pertenece este gasto
  @ManyToOne(() => Trip, trip => trip.expenses)
  trip: Trip;

  // Fecha y hora de creación del gasto, se establece automáticamente
  @CreateDateColumn()
  createdAt: Date;
}