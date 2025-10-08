import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { Expense } from './entities/expense.entity';
import { Trip } from '../trips/entities/trip.entity';
import { User } from '../users/entities/user.entity';

// Módulo que encapsula toda la funcionalidad relacionada con gestión de gastos compartidos
@Module({
  // Registra las entidades Expense, Trip y User para operaciones de base de datos en este módulo
  imports: [TypeOrmModule.forFeature([Expense, Trip, User])],
  // Define el controlador que maneja las peticiones HTTP relacionadas con gastos
  controllers: [ExpensesController],
  // Define los servicios que contienen la lógica de negocio de gastos
  providers: [ExpensesService],
})
export class ExpensesModule {}