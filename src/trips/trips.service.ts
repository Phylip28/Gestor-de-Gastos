import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from './entities/trip.entity';
import { User } from '../users/entities/user.entity';
import { CreateTripDto } from './dto/create-trip.dto';
import { JoinTripDto } from './dto/join-trip.dto';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip)
    private tripRepository: Repository<Trip>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private generateCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  async create(userId: string, createTripDto: CreateTripDto) {
    // ✅ Validar que el creador existe
    const creator = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!creator) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const participants = await this.userRepository.find({
      where: createTripDto.participantEmails.map(email => ({ email })),
    });

    if (!participants.find(p => p.id === userId)) {
      participants.push(creator);
    }

    const trip = this.tripRepository.create({
      name: createTripDto.name,
      currency: createTripDto.currency,
      code: this.generateCode(),
      creator,
      participants,
    });

    await this.tripRepository.save(trip);

    return {
      message: 'Viaje creado exitosamente',
      trip: {
        id: trip.id,
        name: trip.name,
        currency: trip.currency,
        code: trip.code,
      },
    };
  }

  async findUserTrips(userId: string) {
    const trips = await this.tripRepository
      .createQueryBuilder('trip')
      .leftJoin('trip.participants', 'participant')
      .where('participant.id = :userId', { userId })
      .select(['trip.id', 'trip.name', 'trip.currency', 'trip.code'])
      .getMany();

    return trips;
  }

  async join(userId: string, joinTripDto: JoinTripDto) {
    const trip = await this.tripRepository.findOne({
      where: { code: joinTripDto.code },
      relations: ['participants'],
    });

    if (!trip) {
      throw new NotFoundException('Código de viaje inválido');
    }

    // ✅ Validar que el usuario existe
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (trip.participants.some(p => p.id === userId)) {
      throw new BadRequestException('Ya estás en este viaje');
    }

    if (trip.participants.length >= 20) {
      throw new BadRequestException('El viaje ya tiene el máximo de participantes');
    }

    trip.participants.push(user);
    await this.tripRepository.save(trip);

    return {
      message: 'Te has unido al viaje exitosamente',
      trip: {
        id: trip.id,
        name: trip.name,
      },
    };
  }

  async findOne(id: string, userId: string) {
    const trip = await this.tripRepository.findOne({
      where: { id },
      relations: ['participants', 'expenses', 'expenses.payer'],
    });

    if (!trip) {
      throw new NotFoundException('Viaje no encontrado');
    }

    const isParticipant = trip.participants.some(p => p.id === userId);
    if (!isParticipant) {
      throw new BadRequestException('No eres parte de este viaje');
    }

    const totalExpenses = trip.expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
    const userExpenses = trip.expenses
      .filter(exp => exp.payer.id === userId)
      .reduce((sum, exp) => sum + Number(exp.amount), 0);

    return {
      id: trip.id,
      name: trip.name,
      currency: trip.currency,
      totalExpenses,
      userExpenses,
      expenses: trip.expenses.map(exp => ({
        id: exp.id,
        title: exp.title,
        amount: exp.amount,
        payer: exp.payer.name,
        date: exp.createdAt,
      })),
    };
  }
}