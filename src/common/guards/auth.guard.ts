import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

// Guard de autenticación que valida la presencia del header 'user-id' en todas las peticiones protegidas
@Injectable()
export class AuthGuard implements CanActivate {
  // Método que determina si una petición puede continuar o debe ser bloqueada por falta de autenticación
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Extrae el objeto request del contexto de ejecución HTTP
    const request = context.switchToHttp().getRequest();
    // Obtiene el valor del header 'user-id' que identifica al usuario autenticado
    const userId = request.headers['user-id'];

    // Lanza excepción HTTP 401 si el header 'user-id' no está presente en la petición
    if (!userId) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    // Agrega el userId al objeto request para que esté disponible en controladores y servicios
    request.userId = userId;
    // Permite que la petición continúe su ejecución
    return true;
  }
}