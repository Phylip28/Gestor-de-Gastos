import { IsString, IsNumber, IsUUID, IsArray } from 'class-validator';

// DTO para validar los datos de entrada al crear un nuevo gasto compartido en un viaje
export class CreateExpenseDto {
  // Título descriptivo del gasto, debe ser una cadena de texto válida
  @IsString()
  title: string;

  // Monto total del gasto, debe ser un número válido que puede incluir decimales
  @IsNumber()
  amount: number;

  // ID UUID del usuario que pagó el gasto inicialmente
  @IsUUID()
  payerId: string;

  // Array de IDs UUID de los usuarios que compartirán el costo del gasto de forma equitativa
  @IsArray()
  @IsUUID('4', { each: true })
  sharedWithIds: string[];
}