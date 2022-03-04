import { Injectable } from '@nestjs/common';
import query from 'src/app.database';

@Injectable()
export class CarsService {

  async isCarBooking(id: string) {
    const { rows } = await query('SELECT * FROM cars WHERE id = $1', [id]);
    const car = rows[0];
    if (!car.isbooking) {
      return 'Car available for booking!'
    }
    return `This car is already booking on ${car.startbookingday} to ${car.endbookingday}`
  }

  async calculateCost(startDay: string, endDay: string) {
    const { rows } = await query(`SELECT DATE '${endDay}' - DATE '${startDay}';`);
    const days = rows[0]['?column?'];
    let sum = 0;
    for (let i = 1; i <= days; i++) {
      if ( i <= 4 ) {
        sum += 1000;
      } else if ( i > 4 && i <= 9 ) {
        sum += 1000 - ((1000 / 100) * 5);
      } else if ( i > 10 && i <= 17 ) {
        sum += 1000 - ((1000 / 100) * 10);
      } else {
        sum += 1000 - ((1000 / 100) * 15)
      }
    }
    return {sum, days};
  }

  async bookingCar(dayStart: string, dayEnd: string, id: string) {
    const dateStart = new Date(dayStart).getDay();
    const month = new Date(dayStart).getMonth() + 1;
    const dateEnd = new Date(dayEnd).getDay();

    if (Number(dateStart) === 6 || Number(dateStart) === 0) {
      return 'Booking can not be at Saturday or Sunday';
    } else if ((Number(dateEnd) === 6 || Number(dateEnd) === 0)) {
      return 'End of booking can not be at Saturday or Sunday'
    }

    await query(`UPDATE cars SET isbooking = true, startbookingday = $1, endbookingday = $2 WHERE id = $3 ;`, [dayStart, dayEnd, id]);

    const { rows } = await query('SELECT * FROM cars WHERE id = $1', [id]);
    const car = rows[0];
    const { sum, days } = await this.calculateCost(dayStart, dayEnd);
    await query(`INSERT INTO bookinglog(serialnumber, month, bookingdays, price) VALUES($1, $2, $3, $4);`, [car.serialnumber, month, days, sum])
    return `Success! You are booking car with serial number - ${car.serialnumber} from ${dayStart} to ${dayEnd}`;
  }

  async createReport(id: string, month: string) {
    const car = await query('SELECT serialnumber FROM cars WHERE id = $1', [id]);
    const serialNumber = car.rows[0].serialnumber;
    const { rows } = await query('SELECT * FROM bookinglog WHERE serialnumber = $1 AND month = $2;', [serialNumber, month])
    let allDaysBooking = 0;
    rows.forEach((element) => {
      allDaysBooking += element.bookingdays;
    });
    return {serialNumber, allDaysBooking}
  }

  async bookingReport(id: string, month: string) {
    const {serialNumber, allDaysBooking} = await this.createReport(id, month);
    return {[serialNumber]:`Serial Number - ${serialNumber} : % days in booking - ${(allDaysBooking / 30) * 100}%`}
  }

  async getCars() {
    const { rows } = await query('SELECT * FROM cars');
    const month = String(new Date().getMonth() + 1);
  }

}
