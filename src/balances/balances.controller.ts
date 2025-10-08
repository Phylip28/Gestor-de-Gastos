import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { BalancesService } from './balances.service';
import { AuthGuard } from '../common/guards/auth.guard';

// Controlador REST para gestionar endpoints relacionados con balances y liquidación de gastos compartidos
@Controller('trips/:tripId/balances')
// Protege todas las rutas requiriendo autenticación mediante el header 'user-id'
@UseGuards(AuthGuard)
export class BalancesController {
  // Inyecta el servicio de balances para acceder a la lógica de cálculo financiero
  constructor(private balancesService: BalancesService) {}

  // Endpoint GET /trips/:tripId/balances que retorna el balance individual de cada participante del viaje
  @Get()
  // Extrae el ID del viaje desde la URL y el userId del Request agregado por el AuthGuard
  getBalances(@Param('tripId') tripId: string, @Request() req) {
    // Delega al servicio el cálculo de balances validando que el usuario sea participante
    return this.balancesService.getBalances(tripId, req.userId);
  }

  // Endpoint POST /trips/:tripId/balances/settle que genera un plan de transacciones para liquidar todas las deudas
  @Post('settle')
  // Extrae el ID del viaje desde la URL y el userId del Request
  settleBalances(@Param('tripId') tripId: string, @Request() req) {
    // Delega al servicio la generación del plan óptimo de pagos para equilibrar las cuentas
    return this.balancesService.settleBalances(tripId, req.userId);
  }
}