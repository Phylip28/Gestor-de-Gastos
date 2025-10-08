import { IsEmail, IsString, MinLength } from 'class-validator';

// DTO para validar los datos de entrada al registrar un nuevo usuario
export class SignupDto {
  // Correo electrónico del usuario, debe tener formato válido de email
  @IsEmail()
  email: string;

  // Nombre completo del usuario, debe ser una cadena de texto válida
  @IsString()
  name: string;

  // Contraseña del usuario, debe ser una cadena con mínimo 6 caracteres
  @IsString()
  @MinLength(6)
  password: string;
}