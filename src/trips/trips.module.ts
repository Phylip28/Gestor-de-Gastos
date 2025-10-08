import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';
import { Trip } from './entities/trip.entity';
import { User } from '../users/entities/user.entity';

// Módulo que encapsula toda la funcionalidad relacionada con viajes compartidos
@Module({
  // Registra las entidades Trip y User para operaciones de base de datos en este módulo
  imports: [TypeOrmModule.forFeature([Trip, User])],
  // Define el controlador que maneja las peticiones HTTP relacionadas con viajes
  controllers: [TripsController],
  // Define los servicios que contienen la lógica de negocio de viajes
  providers: [TripsService],
})
export class TripsModule {}