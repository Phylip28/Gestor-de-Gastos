import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BalancesController } from './balances.controller';
import { BalancesService } from './balances.service';
import { Trip } from '../trips/entities/trip.entity';
import { Expense } from '../expenses/entities/expense.entity';

// Módulo que encapsula toda la funcionalidad relacionada con cálculo de balances y liquidación de gastos
@Module({
  // Registra las entidades Trip y Expense para operaciones de lectura de viajes y gastos
  imports: [TypeOrmModule.forFeature([Trip, Expense])],
  // Define el controlador que maneja las peticiones HTTP relacionadas con balances
  controllers: [BalancesController],
  // Define los servicios que contienen la lógica de negocio de cálculos financieros
  providers: [BalancesService],
})
export class BalancesModule {}