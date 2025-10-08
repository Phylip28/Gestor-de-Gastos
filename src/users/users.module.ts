import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Module({
  // Registra la entidad User para que TypeORM pueda realizar operaciones de base de datos
  imports: [TypeOrmModule.forFeature([User])],
  // Define el controlador que maneja las peticiones HTTP del módulo de usuarios
  controllers: [UsersController],
  // Define los servicios que contienen la lógica de negocio del módulo
  providers: [UsersService],
  // Exporta TypeOrmModule para que otros módulos puedan acceder al repositorio de User
  exports: [TypeOrmModule],
})
export class UsersModule {}