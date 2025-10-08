import { Controller, Post, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

// Controlador REST para gestionar endpoints de autenticación y registro de usuarios
@Controller('auth')
export class AuthController {
  // Inyecta el servicio de autenticación para acceder a la lógica de negocio
  constructor(private authService: AuthService) {}

  // Endpoint POST /auth/signup para registrar nuevos usuarios en el sistema
  @Post('signup')
  // Extrae y valida los datos del body usando SignupDto
  signup(@Body() signupDto: SignupDto) {
    // Delega la creación del usuario al servicio que hashea la contraseña y guarda en BD
    return this.authService.signup(signupDto);
  }

  // Endpoint POST /auth/login para autenticar usuarios con credenciales
  @Post('login')
  // Extrae y valida email y password del body usando LoginDto
  login(@Body() loginDto: LoginDto) {
    // Delega la validación de credenciales al servicio que verifica email y contraseña
    return this.authService.login(loginDto);
  }
}