import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { CarsService } from './cars.service';
import { Days, Month } from './dto/cost-calculation.dto';

@Controller('cars')
export class CarsController {
  constructor(private readonly appService: AppService, private readonly carsService: CarsService) {}

  @Get(':id')
  isOnline( @Param('id') id: string ) {
    return this.carsService.isCarBooking(id);
  }

  @Post()
  createReport() {
    return this.carsService.bookingReport();
  }

  @Post(':id')
  costCalculation(@Body() days: Days) {
    return this.carsService.calculateCost(days.startDay, days.endDay);
  }

  @Patch(':id')
  carBooking(@Body() days: Days, @Param('id') id: string ) {
    return this.carsService.bookingCar(days.startDay, days.endDay, id);
  }

  @Get()
  getCars() {
    return this.carsService.getCars();
  }
}
