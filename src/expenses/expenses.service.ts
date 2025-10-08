import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './entities/expense.entity';
import { Trip } from '../trips/entities/trip.entity';
import { User } from '../users/entities/user.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';

// Servicio que contiene la lógica de negocio para gestionar gastos compartidos en viajes
@Injectable()
export class ExpensesService {
  // Inyecta los repositorios necesarios para operaciones de base de datos con gastos, viajes y usuarios
  constructor(
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
    @InjectRepository(Trip)
    private tripRepository: Repository<Trip>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Crea un nuevo gasto en un viaje validando permisos y existencia de participantes involucrados
  async create(tripId: string, userId: string, createExpenseDto: CreateExpenseDto) {
  // Busca el viaje por ID incluyendo la lista completa de participantes para validaciones
  const trip = await this.tripRepository.findOne({
    where: { id: tripId },
    relations: ['participants'],
  });

  // Lanza excepción HTTP 404 si el viaje especificado no existe en la base de datos
  if (!trip) {
    throw new NotFoundException('Viaje no encontrado');
  }

  // Verifica que el usuario autenticado sea participante del viaje antes de permitir crear gastos
  const isParticipant = trip.participants.some(p => p.id === userId);
  if (!isParticipant) {
    throw new BadRequestException('No eres parte de este viaje');
  }

  // Busca el usuario designado como pagador del gasto para validar su existencia
  const payer = await this.userRepository.findOne({
    where: { id: createExpenseDto.payerId },
  });

  // Lanza excepción HTTP 404 si el usuario pagador no existe en la base de datos
  if (!payer) {
    throw new NotFoundException('Usuario pagador no encontrado');
  }

  // Obtiene todos los usuarios con quienes se compartirá el gasto usando sus IDs
  const sharedWith = await this.userRepository.find({
    where: createExpenseDto.sharedWithIds.map(id => ({ id })),
  });

  // Valida que se hayan encontrado todos los usuarios especificados en la lista de beneficiarios
  if (sharedWith.length !== createExpenseDto.sharedWithIds.length) {
    throw new NotFoundException('Algunos usuarios no fueron encontrados');
  }

  // Crea la instancia del gasto con todos los datos validados y relaciones establecidas
  const expense = this.expenseRepository.create({
    title: createExpenseDto.title,
    amount: createExpenseDto.amount,
    payer,
    sharedWith,
    trip,
  });

  // Persiste el nuevo gasto en la base de datos
  await this.expenseRepository.save(expense);

  // Retorna mensaje de éxito con información básica del gasto creado
  return {
    message: 'Gasto registrado exitosamente',
    expense: {
      id: expense.id,
      title: expense.title,
      amount: expense.amount,
    },
  };
}

  // Obtiene la lista completa de gastos de un viaje ordenados por fecha de creación descendente
  async findTripExpenses(tripId: string, userId: string) {
    // Busca el viaje por ID incluyendo participantes para validar permisos de acceso
    const trip = await this.tripRepository.findOne({
      where: { id: tripId },
      relations: ['participants'],
    });

    // Lanza excepción HTTP 404 si el viaje no existe
    if (!trip) {
      throw new NotFoundException('Viaje no encontrado');
    }

    // Verifica que el usuario autenticado sea participante antes de mostrar información financiera
    const isParticipant = trip.participants.some(p => p.id === userId);
    if (!isParticipant) {
      throw new BadRequestException('No eres parte de este viaje');
    }

    // Obtiene todos los gastos del viaje incluyendo información del pagador y ordenados del más reciente al más antiguo
    const expenses = await this.expenseRepository.find({
      where: { trip: { id: tripId } },
      relations: ['payer'],
      order: { createdAt: 'DESC' },
    });

    // Transforma el array de gastos a un formato simplificado con información esencial
    return expenses.map(exp => ({
      id: exp.id,
      title: exp.title,
      amount: exp.amount,
      payer: exp.payer.name,
      date: exp.createdAt,
    }));
  }

  // Obtiene los detalles completos de un gasto específico incluyendo pagador y lista de beneficiarios
  async findOne(tripId: string, expenseId: string, userId: string) {
    // Busca el gasto por ID incluyendo todas sus relaciones: pagador, beneficiarios, viaje y participantes del viaje
    const expense = await this.expenseRepository.findOne({
      where: { id: expenseId, trip: { id: tripId } },
      relations: ['payer', 'sharedWith', 'trip', 'trip.participants'],
    });

    // Lanza excepción HTTP 404 si el gasto no existe o no pertenece al viaje especificado
    if (!expense) {
      throw new NotFoundException('Gasto no encontrado');
    }

    // Verifica que el usuario autenticado sea participante del viaje antes de mostrar detalles del gasto
    const isParticipant = expense.trip.participants.some(p => p.id === userId);
    if (!isParticipant) {
      throw new BadRequestException('No eres parte de este viaje');
    }

    // Retorna información detallada del gasto con datos del pagador y lista completa de beneficiarios
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