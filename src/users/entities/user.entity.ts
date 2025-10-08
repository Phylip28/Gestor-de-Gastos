import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany } from 'typeorm';
import { Trip } from '../../trips/entities/trip.entity';

// Entidad que representa un usuario en la base de datos
@Entity('users')
export class User {
  // Identificador único del usuario generado automáticamente como UUID
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Correo electrónico del usuario, debe ser único en la base de datos
  @Column({ unique: true })
  email: string;

  // Nombre completo del usuario
  @Column()
  name: string;

  // Contraseña del usuario almacenada en formato hash
  @Column()
  password: string;

  // Fecha y hora de creación del registro, se establece automáticamente
  @CreateDateColumn()
  createdAt: Date;

  // Relación muchos a muchos con viajes, un usuario puede participar en múltiples viajes
  @ManyToMany(() => Trip, trip => trip.participants)
  trips: Trip[];
}