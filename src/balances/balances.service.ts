import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from '../trips/entities/trip.entity';
import { Expense } from '../expenses/entities/expense.entity';

@Injectable()
export class BalancesService {
  constructor(
    @InjectRepository(Trip)
    private tripRepository: Repository<Trip>,
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
  ) {}

  async getBalances(tripId: string, userId: string) {
    const trip = await this.tripRepository.findOne({
      where: { id: tripId },
      relations: ['participants'],
    });

    if (!trip) {
      throw new NotFoundException('Viaje no encontrado');
    }

    const isParticipant = trip.participants.some(p => p.id === userId);
    if (!isParticipant) {
      throw new BadRequestException('No eres parte de este viaje');
    }

    const expenses = await this.expenseRepository.find({
      where: { trip: { id: tripId } },
      relations: ['payer', 'sharedWith'],
    });

    const balances = {};
    trip.participants.forEach(p => {
      balances[p.id] = { name: p.name, balance: 0 };
    });

    expenses.forEach(expense => {
      const shareAmount = Number(expense.amount) / expense.sharedWith.length;
      
      balances[expense.payer.id].balance += Number(expense.amount);
      
      expense.sharedWith.forEach(person => {
        balances[person.id].balance -= shareAmount;
      });
    });

    return Object.entries(balances).map(([id, data]: [string, any]) => ({
      userId: id,
      name: data.name,
      balance: Math.round(data.balance * 100) / 100,
    }));
  }

  async settleBalances(tripId: string, userId: string) {
    const balances = await this.getBalances(tripId, userId);

    const debtors = balances.filter(b => b.balance < 0);
    const creditors = balances.filter(b => b.balance > 0);

    const transactions: { from: string; to: string; amount: number }[] = [];

    debtors.forEach(debtor => {
      let remaining = Math.abs(debtor.balance);

      creditors.forEach(creditor => {
        if (remaining > 0 && creditor.balance > 0) {
          const amount = Math.min(remaining, creditor.balance);
          
          transactions.push({
            from: debtor.name,
            to: creditor.name,
            amount: Math.round(amount * 100) / 100,
          });

          remaining -= amount;
          creditor.balance -= amount;
        }
      });
    });

    return {
      message: 'Cálculo de equilibrio completado',
      transactions,
    };
  }
}