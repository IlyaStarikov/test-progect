import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CostCalculation } from './dto/cost-calculation.dto';

@Controller('cars')
export class CarsController {

  @Get(':id')
  isOnline( @Param('id') id: string ) {
    return 'Car is online controller' + id
  }

  @Post()
  costCalculation(@Body() calculation: CostCalculation) {
    
  }
}
