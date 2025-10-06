import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async signup(signupDto: SignupDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: signupDto.email },
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(signupDto.password, 10);

    const user = this.userRepository.create({
      ...signupDto,
      password: hashedPassword,
    });

    await this.userRepository.save(user);

    return {
      message: 'Usuario creado exitosamente',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

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