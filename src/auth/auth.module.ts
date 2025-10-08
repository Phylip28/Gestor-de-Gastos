import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';

// Modulo principal de autenticacion que gestiona la logica de login y registro
@Module({
  // Importa el modulo de usuarios para acceder a sus servicios
  imports: [UsersModule],
  // Controlador que maneja las rutas de autenticacion
  controllers: [AuthController],
  // Servicio que contiene la logica de negocio de autenticacion
  providers: [AuthService],
})
export class AuthModule {}