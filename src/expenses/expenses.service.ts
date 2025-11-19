import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './entities/expense.entity';
import { Trip } from '../trips/entities/trip.entity';
import { User } from '../users/entities/user.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
    @InjectRepository(Trip)
    private tripRepository: Repository<Trip>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(tripId: string, userId: string, createExpenseDto: CreateExpenseDto) {
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

  // ✅ Validar que el pagador existe
  const payer = await this.userRepository.findOne({
    where: { id: createExpenseDto.payerId },
  });

  if (!payer) {
    throw new NotFoundException('Usuario pagador no encontrado');
  }

  const sharedWith = await this.userRepository.find({
    where: createExpenseDto.sharedWithIds.map(id => ({ id })),
  });

  // ✅ Opcional: Validar que se encontraron todos los usuarios
  if (sharedWith.length !== createExpenseDto.sharedWithIds.length) {
    throw new NotFoundException('Algunos usuarios no fueron encontrados');
  }

  const expense = this.expenseRepository.create({
    title: createExpenseDto.title,
    amount: createExpenseDto.amount,
    payer,
    sharedWith,
    trip,
  });

  await this.expenseRepository.save(expense);

  return {
    message: 'Gasto registrado exitosamente',
    expense: {
      id: expense.id,
      title: expense.title,
      amount: expense.amount,
    },
  };
}

  async findTripExpenses(tripId: string, userId: string) {
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
      relations: ['payer'],
      order: { createdAt: 'DESC' },
    });

    return expenses.map(exp => ({
      id: exp.id,
      title: exp.title,
      amount: exp.amount,
      payer: exp.payer.name,
      date: exp.createdAt,
    }));
  }

  async findOne(tripId: string, expenseId: string, userId: string) {
    const expense = await this.expenseRepository.findOne({
      where: { id: expenseId, trip: { id: tripId } },
      relations: ['payer', 'sharedWith', 'trip', 'trip.participants'],
    });

    if (!expense) {
      throw new NotFoundException('Gasto no encontrado');
    }

    const isParticipant = expense.trip.participants.some(p => p.id === userId);
    if (!isParticipant) {
      throw new BadRequestException('No eres parte de este viaje');
    }

    return {
      id: expense.id,
      title: expense.title,
      amount: expense.amount,
      payer: {
        id: expense.payer.id,
        name: expense.payer.name,
      },
      sharedWith: expense.sharedWith.map(user => ({
        id: user.id,
        name: user.name,
      })),
      date: expense.createdAt,
    };
  }
}