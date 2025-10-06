import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BalancesController } from './balances.controller';
import { BalancesService } from './balances.service';
import { Trip } from '../trips/entities/trip.entity';
import { Expense } from '../expenses/entities/expense.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Trip, Expense])],
  controllers: [BalancesController],
  providers: [BalancesService],
})
export class BalancesModule {}