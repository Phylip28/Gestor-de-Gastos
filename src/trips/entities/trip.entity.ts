import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany, JoinTable, OneToMany, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Expense } from '../../expenses/entities/expense.entity';

// Entidad que representa un viaje compartido en la base de datos
@Entity('trips')
export class Trip {
  // Identificador único del viaje generado automáticamente como UUID
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Nombre descriptivo del viaje
  @Column()
  name: string;

  // Moneda utilizada para los gastos del viaje, puede ser 'COP' o 'USD'
  @Column()
  currency: string;

  // Código único de 6 caracteres alfanuméricos para unirse al viaje
  @Column({ unique: true })
  code: string;

  // Relación muchos a uno con el usuario que creó el viaje
  @ManyToOne(() => User)
  creator: User;

  // Relación muchos a muchos con usuarios participantes del viaje
  @ManyToMany(() => User, user => user.trips)
  @JoinTable()
  participants: User[];

  // Relación uno a muchos con los gastos registrados en el viaje
  @OneToMany(() => Expense, expense => expense.trip)
  expenses: Expense[];

  // Fecha y hora de creación del viaje, se establece automáticamente
  @CreateDateColumn()
  createdAt: Date;
}