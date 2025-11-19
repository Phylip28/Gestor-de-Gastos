import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { JoinTripDto } from './dto/join-trip.dto';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('trips')
@UseGuards(AuthGuard)
export class TripsController {
  constructor(private tripsService: TripsService) {}

  @Post()
  create(@Request() req, @Body() createTripDto: CreateTripDto) {
    return this.tripsService.create(req.userId, createTripDto);
  }

  @Get()
  findUserTrips(@Request() req) {
    return this.tripsService.findUserTrips(req.userId);
  }

  @Post('join')
  join(@Request() req, @Body() joinTripDto: JoinTripDto) {
    return this.tripsService.join(req.userId, joinTripDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.tripsService.findOne(id, req.userId);
  }
}