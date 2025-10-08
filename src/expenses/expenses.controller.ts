import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { AuthGuard } from '../common/guards/auth.guard';

// Controlador REST para gestionar endpoints relacionados con gastos compartidos en viajes
@Controller('trips/:tripId/expenses')
// Protege todas las rutas requiriendo autenticación mediante el header 'user-id'
@UseGuards(AuthGuard)
export class ExpensesController {
  // Inyecta el servicio de gastos para acceder a la lógica de negocio
  constructor(private expensesService: ExpensesService) {}

  // Endpoint POST /trips/:tripId/expenses para crear un nuevo gasto en el viaje especificado
  @Post()
  // Extrae el ID del viaje desde la URL, el userId del Request y valida el DTO con los datos del gasto
  create(
    @Param('tripId') tripId: string,
    @Request() req,
    @Body() createExpenseDto: CreateExpenseDto,
  ) {
    // Delega la creación del gasto al servicio pasando el ID del viaje, usuario y datos validados
    return this.expensesService.create(tripId, req.userId, createExpenseDto);
  }

  // Endpoint GET /trips/:tripId/expenses que retorna todos los gastos del viaje ordenados por fecha
  @Get()
  // Extrae el ID del viaje desde la URL y el userId del Request agregado por el AuthGuard
  findTripExpenses(@Param('tripId') tripId: string, @Request() req) {
    // Delega la búsqueda de gastos al servicio validando que el usuario sea participante
    return this.expensesService.findTripExpenses(tripId, req.userId);
  }

  // Endpoint GET /trips/:tripId/expenses/:expenseId que retorna los detalles completos de un gasto específico
  @Get(':expenseId')
  // Extrae el ID del viaje y del gasto desde la URL, y el userId del Request
  findOne(
    @Param('tripId') tripId: string,
    @Param('expenseId') expenseId: string,
    @Request() req,
  ) {
    // Delega la búsqueda del gasto al servicio validando permisos y existencia
    return this.expensesService.findOne(tripId, expenseId, req.userId);
  }
}