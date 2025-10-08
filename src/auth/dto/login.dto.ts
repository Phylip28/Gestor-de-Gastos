import { IsEmail, IsString } from 'class-validator';

// DTO para validar los datos de entrada al iniciar sesión
export class LoginDto {
  // Correo electrónico del usuario, debe tener formato válido de email
  @IsEmail()
  email: string;

  // Contraseña del usuario, debe ser una cadena de texto válida
  @IsString()
  password: string;
}