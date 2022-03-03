import { Injectable } from '@nestjs/common';
import query from 'src/app.database';

@Injectable()
export class CarsService {
  async getCars() {
    const { rows } = await query('SELECT * FROM cars');
    return rows;
  }

  async isCarBooking(id: string) {
    const { rows } = await query('SELECT isbooking FROM cars WHERE id = $1', [id]);
    return rows[0].isbooking;
  }

  async bookingCar() {
    const { rows } = await query("SELECT EXTRACT(ISODOW FROM TIMESTAMP '2001-02-18 20:38:40');");
    return rows;
  }

  calculateCost(days: number) {
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
    return sum;
  }
}
