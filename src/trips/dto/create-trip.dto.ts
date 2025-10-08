import { IsString, IsArray, IsIn, ArrayMaxSize } from 'class-validator';

// DTO para validar los datos de entrada al crear un nuevo viaje
export class CreateTripDto {
  // Nombre del viaje, debe ser una cadena de texto válida
  @IsString()
  name: string;

  // Moneda del viaje, solo acepta 'COP' pesos colombianos o 'USD' dólares americanos
  @IsString()
  @IsIn(['COP', 'USD'])
  currency: string;

  // Lista de correos electrónicos de los participantes, máximo 20 personas por viaje
  @IsArray()
  @ArrayMaxSize(20)
  participantEmails: string[];
}