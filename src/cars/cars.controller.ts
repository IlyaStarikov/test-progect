import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { CarsService } from './cars.service';
import { CostCalculation } from './dto/cost-calculation.dto';

@Controller('cars')
export class CarsController {
  constructor(private readonly appService: AppService, private readonly carsService: CarsService) {}

  @Get(':id')
  isOnline( @Param('id') id: string ) {
    return this.carsService.isCarBooking(id);
  }

  @Post()
  costCalculation(@Body() calculation: CostCalculation) {
    return this.carsService.calculateCost(calculation.days);
  }

  @Post(':id')
  carBooking() {
    return this.carsService.bookingCar();
  }

  @Get()
  getCars() {
    return this.carsService.getCars();
    
  }
}
