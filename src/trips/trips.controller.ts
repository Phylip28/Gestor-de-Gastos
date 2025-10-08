import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { JoinTripDto } from './dto/join-trip.dto';
import { AuthGuard } from '../common/guards/auth.guard';

// Controlador REST para gestionar endpoints relacionados con viajes compartidos
@Controller('trips')
// Protege todas las rutas requiriendo autenticación mediante el header 'user-id'
@UseGuards(AuthGuard)
export class TripsController {
  // Inyecta el servicio de viajes para acceder a la lógica de negocio
  constructor(private tripsService: TripsService) {}

  // Endpoint POST /trips para crear un nuevo viaje con participantes
  @Post()
  // Extrae el userId del Request y valida el DTO con los datos del viaje
  create(@Request() req, @Body() createTripDto: CreateTripDto) {
    // Delega la creación del viaje al servicio pasando el ID del creador y los datos validados
    return this.tripsService.create(req.userId, createTripDto);
  }

  // Endpoint GET /trips que retorna todos los viajes donde el usuario es participante
  @Get()
  // Extrae el userId del Request agregado por el AuthGuard
  findUserTrips(@Request() req) {
    // Delega la búsqueda de viajes al servicio usando el ID del usuario autenticado
    return this.tripsService.findUserTrips(req.userId);
  }

  // Endpoint POST /trips/join para unirse a un viaje existente mediante código
  @Post('join')
  // Extrae el userId del Request y valida el DTO con el código del viaje
  join(@Request() req, @Body() joinTripDto: JoinTripDto) {
    // Delega la operación de unirse al viaje al servicio con el ID del usuario y el código
    return this.tripsService.join(req.userId, joinTripDto);
  }

  // Endpoint GET /trips/:id que retorna los detalles de un viaje específico con sus gastos
  @Get(':id')
  // Extrae el ID del viaje desde la URL y el userId del Request
  findOne(@Param('id') id: string, @Request() req) {
    // Delega la búsqueda del viaje al servicio validando que el usuario sea participante
    return this.tripsService.findOne(id, req.userId);
  }
}