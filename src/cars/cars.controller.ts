import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CarsService } from './cars.service';
import { Days, Month } from './dto/cost-calculation.dto';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get(':id')
  isOnline( @Param('id') id: string ) {
    return this.carsService.isCarBooking(id);
  }

  @Post('report')
  createReport( @Body() month: Month ) {
    return this.carsService.bookingReport(month.month);
  }

  @Post()
  costCalculation(@Body() days: Days) {
    return this.carsService.calculateCost(days.startDay, days.endDay);
  }

  @Patch(':id')
  carBooking(@Body() days: Days, @Param('id') id: string ) {
    return this.carsService.bookingCar(days.startDay, days.endDay, id);
  }
}
