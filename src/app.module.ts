import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TripsModule } from './trips/trips.module';
import { ExpensesModule } from './expenses/expenses.module';
import { BalancesModule } from './balances/balances.module';

// Módulo raíz de la aplicación que configura la base de datos e importa todos los módulos funcionales
@Module({
  imports: [
    // Configura TypeORM para manejar la conexión y operaciones con la base de datos SQLite
    TypeOrmModule.forRoot({
      // Define SQLite como motor de base de datos por ser ligero y no requerir instalación adicional
      type: 'sqlite',
      // Usa base de datos en memoria que se borra al detener el servidor, útil para desarrollo y testing
      database: ':memory:',
      // Para persistir datos entre reinicios descomentar: database: 'trip_expenses.sqlite',
      // Registra automáticamente todas las entidades encontradas en archivos con extensión .entity.ts o .entity.js
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      // Sincroniza automáticamente el esquema de base de datos con las entidades en cada inicio, solo para desarrollo
      synchronize: true,
      // Desactiva el registro de queries SQL en consola, cambiar a true para depuración
      logging: false,
    }),
    // Módulo de autenticación que gestiona registro y login de usuarios
    AuthModule,
    // Módulo de usuarios que maneja la creación y consulta de perfiles de usuario
    UsersModule,
    // Módulo de viajes que administra la creación, consulta y unión a viajes compartidos
    TripsModule,
    // Módulo de gastos que registra y consulta los gastos compartidos dentro de cada viaje
    ExpensesModule,
    // Módulo de balances que calcula deudas entre participantes y genera planes de liquidación
    BalancesModule,
  ],
})
export class AppModule {}