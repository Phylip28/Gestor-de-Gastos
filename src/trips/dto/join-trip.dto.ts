import { IsString } from 'class-validator';

// DTO para validar los datos de entrada al unirse a un viaje existente mediante código
export class JoinTripDto {
  // Código único de 6 caracteres alfanuméricos generado al crear el viaje
  @IsString()
  code: string;
}