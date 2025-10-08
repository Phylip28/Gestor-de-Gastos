import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

// Función asíncrona que inicializa y configura el servidor NestJS
async function bootstrap() {
  // Crea una instancia de la aplicación NestJS usando el módulo raíz AppModule
  const app = await NestFactory.create(AppModule);
  // Activa la validación automática de DTOs en todas las rutas usando class-validator
  app.useGlobalPipes(new ValidationPipe());
  // Habilita CORS para permitir peticiones desde cualquier origen, necesario para aplicaciones frontend
  app.enableCors();
  // Inicia el servidor HTTP en el puerto 3000 y espera conexiones entrantes
  await app.listen(3000);
  // Muestra mensaje en consola indicando que el servidor está listo para recibir peticiones
  console.log('Aplicación corriendo en http://localhost:3000');
}
// Ejecuta la función bootstrap para iniciar la aplicación
bootstrap();