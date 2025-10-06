import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { BalancesService } from './balances.service';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('trips/:tripId/balances')
@UseGuards(AuthGuard)
export class BalancesController {
  constructor(private balancesService: BalancesService) {}

  @Get()
  getBalances(@Param('tripId') tripId: string, @Request() req) {
    return this.balancesService.getBalances(tripId, req.userId);
  }

  @Post('settle')
  settleBalances(@Param('tripId') tripId: string, @Request() req) {
    return this.balancesService.settleBalances(tripId, req.userId);
  }
}