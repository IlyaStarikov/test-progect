import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CarsController } from './cars/cars.controller';
import { CarsService } from './cars/cars.service';

@Module({
  imports: [],
  controllers: [AppController, CarsController],
  providers: [AppService, CarsService],
})
export class AppModule {}
