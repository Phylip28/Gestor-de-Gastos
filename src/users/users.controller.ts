import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../common/guards/auth.guard';

// Controlador REST para gestionar endpoints relacionados con usuarios
@Controller('users')
// Protege todas las rutas del controlador requiriendo autenticación mediante el header 'user-id'
@UseGuards(AuthGuard)
export class UsersController {
  // Inyecta el servicio de usuarios para acceder a la lógica de negocio
  constructor(private usersService: UsersService) {}

  // Endpoint GET /users/profile que retorna el perfil del usuario autenticado
  @Get('profile')
  // Extrae el userId del objeto Request que fue agregado por el AuthGuard
  getProfile(@Request() req) {
    // Delega al servicio la obtención del perfil usando el ID del usuario autenticado
    return this.usersService.getProfile(req.userId);
  }
}