import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TripsModule } from './trips/trips.module';
import { ExpensesModule } from './expenses/expenses.module';
import { BalancesModule } from './balances/balances.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:', // Base de datos en memoria (no persiste datos)
      // Si quieres que persistan: database: 'trip_expenses.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: false, // Cambia a true si quieres ver las queries SQL
    }),
    AuthModule,
    UsersModule,
    TripsModule,
    ExpensesModule,
    BalancesModule,
  ],
})
export class AppModule {}