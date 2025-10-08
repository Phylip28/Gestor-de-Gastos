import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

// Pipe personalizado para validar objetos DTO usando decoradores de class-validator antes de ejecutar el controlador
@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  // Método principal que transforma y valida el valor recibido según el metatipo esperado
  async transform(value: any, { metatype }: ArgumentMetadata) {
    // Omite validación si no hay metatipo o si es un tipo primitivo nativo de JavaScript
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    // Convierte el objeto plano recibido en una instancia de la clase DTO correspondiente
    const object = plainToInstance(metatype, value);
    // Ejecuta las validaciones definidas en los decoradores del DTO
    const errors = await validate(object);

    // Si hay errores de validación, extrae los mensajes y lanza una excepción HTTP 400
    if (errors.length > 0) {
      // Mapea todos los errores extrayendo los mensajes de cada constraint violado
      const messages = errors.map(err => {
        return Object.values(err.constraints ?? {}).join(', ');
      });
      // Lanza BadRequestException con la lista de mensajes de error
      throw new BadRequestException(messages);
    }

    // Retorna el valor original si todas las validaciones pasaron correctamente
    return value;
  }

  // Método auxiliar que determina si un tipo debe ser validado o es un tipo primitivo de JavaScript
  private toValidate(metatype: Function): boolean {
    // Lista de tipos nativos que no requieren validación con class-validator
    const types: Function[] = [String, Boolean, Number, Array, Object];
    // Retorna true solo si el tipo no está en la lista de primitivos
    return !types.includes(metatype);
  }
}