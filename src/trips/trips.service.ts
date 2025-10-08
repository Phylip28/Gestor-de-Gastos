import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from './entities/trip.entity';
import { User } from '../users/entities/user.entity';
import { CreateTripDto } from './dto/create-trip.dto';
import { JoinTripDto } from './dto/join-trip.dto';

// Servicio que contiene la lógica de negocio para operaciones relacionadas con viajes compartidos
@Injectable()
export class TripsService {
  // Inyecta los repositorios de Trip y User para operaciones de base de datos
  constructor(
    @InjectRepository(Trip)
    private tripRepository: Repository<Trip>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Genera un código alfanumérico aleatorio de 6 caracteres en mayúsculas
  private generateCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  // Crea un nuevo viaje con el usuario autenticado como creador y agrega participantes por email
  async create(userId: string, createTripDto: CreateTripDto) {
    // Busca el usuario creador en la base de datos para validar su existencia
    const creator = await this.userRepository.findOne({ where: { id: userId } });
    
    // Lanza excepción 404 si el usuario no existe
    if (!creator) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Busca todos los usuarios que coincidan con los emails proporcionados
    const participants = await this.userRepository.find({
      where: createTripDto.participantEmails.map(email => ({ email })),
    });

    // Agrega el creador a la lista de participantes si no está incluido
    if (!participants.find(p => p.id === userId)) {
      participants.push(creator);
    }

    // Crea la instancia del viaje con todos los datos y relaciones
    const trip = this.tripRepository.create({
      name: createTripDto.name,
      currency: createTripDto.currency,
      code: this.generateCode(),
      creator,
      participants,
    });

    // Persiste el viaje en la base de datos
    await this.tripRepository.save(trip);

    // Retorna mensaje de éxito con los datos básicos del viaje creado
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

  // Obtiene todos los viajes donde el usuario autenticado es participante
  async findUserTrips(userId: string) {
    // Consulta usando QueryBuilder para unir con participantes y filtrar por usuario
    const trips = await this.tripRepository
      .createQueryBuilder('trip')
      .leftJoin('trip.participants', 'participant')
      .where('participant.id = :userId', { userId })
      .select(['trip.id', 'trip.name', 'trip.currency', 'trip.code'])
      .getMany();

    // Retorna lista de viajes con información básica
    return trips;
  }

  // Permite al usuario autenticado unirse a un viaje existente mediante código
  async join(userId: string, joinTripDto: JoinTripDto) {
    // Busca el viaje por código incluyendo la lista de participantes
    const trip = await this.tripRepository.findOne({
      where: { code: joinTripDto.code },
      relations: ['participants'],
    });

    // Lanza excepción 404 si el código no corresponde a ningún viaje
    if (!trip) {
      throw new NotFoundException('Código de viaje inválido');
    }

    // Valida que el usuario existe en la base de datos
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    // Lanza excepción 404 si el usuario no existe
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verifica si el usuario ya es participante del viaje
    if (trip.participants.some(p => p.id === userId)) {
      throw new BadRequestException('Ya estás en este viaje');
    }

    // Valida que el viaje no haya alcanzado el límite de 20 participantes
    if (trip.participants.length >= 20) {
      throw new BadRequestException('El viaje ya tiene el máximo de participantes');
    }

    // Agrega el usuario a la lista de participantes
    trip.participants.push(user);
    // Persiste los cambios en la base de datos
    await this.tripRepository.save(trip);

    // Retorna mensaje de éxito con información básica del viaje
    return {
      message: 'Te has unido al viaje exitosamente',
      trip: {
        id: trip.id,
        name: trip.name,
      },
    };
  }

  // Obtiene los detalles completos de un viaje incluyendo gastos y totales
  async findOne(id: string, userId: string) {
    // Busca el viaje con todas sus relaciones: participantes, gastos y pagadores
    const trip = await this.tripRepository.findOne({
      where: { id },
      relations: ['participants', 'expenses', 'expenses.payer'],
    });

    // Lanza excepción 404 si el viaje no existe
    if (!trip) {
      throw new NotFoundException('Viaje no encontrado');
    }

    // Verifica que el usuario autenticado sea participante del viaje
    const isParticipant = trip.participants.some(p => p.id === userId);
    if (!isParticipant) {
      throw new BadRequestException('No eres parte de este viaje');
    }

    // Calcula el total de todos los gastos del viaje
    const totalExpenses = trip.expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
    // Calcula el total de gastos pagados por el usuario autenticado
    const userExpenses = trip.expenses
      .filter(exp => exp.payer.id === userId)
      .reduce((sum, exp) => sum + Number(exp.amount), 0);

    // Retorna información detallada del viaje con resumen de gastos
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