import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('trips/:tripId/expenses')
@UseGuards(AuthGuard)
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  @Post()
  create(
    @Param('tripId') tripId: string,
    @Request() req,
    @Body() createExpenseDto: CreateExpenseDto,
  ) {
    return this.expensesService.create(tripId, req.userId, createExpenseDto);
  }

  @Get()
  findTripExpenses(@Param('tripId') tripId: string, @Request() req) {
    return this.expensesService.findTripExpenses(tripId, req.userId);
  }

  @Get(':expenseId')
  findOne(
    @Param('tripId') tripId: string,
    @Param('expenseId') expenseId: string,
    @Request() req,
  ) {
    return this.expensesService.findOne(tripId, expenseId, req.userId);
  }
}