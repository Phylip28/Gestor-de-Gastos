import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

// Servicio encargado de la logica de autenticacion y registro de usuarios
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>, // Repositorio para operaciones CRUD de usuarios
  ) {}

  // Registra un nuevo usuario en el sistema
  async signup(signupDto: SignupDto) {
    // Verifica si el email ya esta registrado en la base de datos
    const existingUser = await this.userRepository.findOne({
      where: { email: signupDto.email },
    });

    // Lanza excepcion si el email ya existe
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Encripta la contrasena usando bcrypt con 10 rondas de salt
    const hashedPassword = await bcrypt.hash(signupDto.password, 10);

    // Crea la instancia del usuario con la contrasena encriptada
    const user = this.userRepository.create({
      ...signupDto,
      password: hashedPassword,
    });

    // Guarda el usuario en la base de datos
    await this.userRepository.save(user);

    // Retorna mensaje de exito y datos basicos del usuario sin la contrasena
    return {
      message: 'Usuario creado exitosamente',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  // Autentica un usuario existente verificando sus credenciales
  async login(loginDto: LoginDto) {
    // Busca el usuario por email en la base de datos
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    // Lanza excepcion si el usuario no existe
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Compara la contrasena ingresada con el hash almacenado
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    // Lanza excepcion si la contrasena no coincide
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Retorna mensaje de exito y datos basicos del usuario autenticado
    return {
      message: 'Login exitoso',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}