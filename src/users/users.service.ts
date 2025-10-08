import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

// Servicio que contiene la lógica de negocio para operaciones relacionadas con usuarios
@Injectable()
export class UsersService {
  // Inyecta el repositorio de TypeORM para realizar consultas a la tabla de usuarios
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Obtiene el perfil público de un usuario por su ID, excluyendo la contraseña
  async getProfile(userId: string) {
    // Busca el usuario en la base de datos seleccionando solo campos seguros
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'email', 'name', 'createdAt'],
    });

    // Lanza una excepción HTTP 404 si el usuario no existe
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Retorna el perfil del usuario sin información sensible
    return user;
  }
}