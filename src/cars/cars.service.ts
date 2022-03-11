import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import query from 'src/app.database';

@Injectable()
export class CarsService {

  async isCarBooking(id: string) {
    const { rows } = await query('SELECT * FROM cars WHERE id = $1', [id]);
    const car = rows[0];
    if (!car.isbooking) {
      return 'Car available for booking!'
    }
    return `Car is already booking in ${car.startbookingday} to ${car.endbookingday}!`
  }

  async calculateCost(startDay: string, endDay: string) {
    try {
      const { rows } = await query(`SELECT DATE '${endDay}' - DATE '${startDay}';`);
      const daysCount = rows[0]['?column?'] + 1;
      const basePrice = 1000;
  
      if (daysCount > 30) {
        throw 'Max booking is 30 days'
      } else if (daysCount <= 0) {
        throw 'Start booking day cannot be greater than end booking day!'
      }
      
      const getSalePercent = (dayNumber: number) => {
        if (dayNumber <= 4) {
          return 0;
        } else if (dayNumber > 4 && dayNumber <= 9) {
          return 5;
        } else if (dayNumber > 9 && dayNumber <= 17) {
          return 10;
        }
        return 15;
      };
  
      let salePercent = 0;
      for (let i = 1; i <= daysCount; i++) {
        salePercent += getSalePercent(i);
      }
  
      const sale = basePrice * salePercent / 100;
      const sum = daysCount * basePrice - sale;
    
      return {sum, daysCount};
    } catch (e) {
      throw new HttpException({
        error: e,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  async bookingCar(dayStart: string, dayEnd: string, id: string) {
    try {

      const { rows: column } = await query(`SELECT DATE '${dayEnd}' - DATE '${dayStart}';`);
      const monthDays = column[0]['?column?'];

      if (monthDays > 30) {
        throw 'Max booking is 30 days'
      }
      const start = new Date(dayStart);
      const end = new Date(dayEnd);
      const dateStart = start.getDay();
      const month = start.getMonth() + 1;
      const startYear = start.getFullYear();
      const endYear = end.getFullYear();
      const dateEnd = end.getDay();
      const monthEnd = end.getMonth();
      const dataWeekDays = [0, 6];
      const checkIsWeekDayAllowed = (date: number): boolean => dataWeekDays.includes(date);
  
      if (checkIsWeekDayAllowed(dateStart)) {
        throw 'Booking can not be at Saturday or Sunday';
      } else if (checkIsWeekDayAllowed(dateEnd)) {
        throw 'End of booking can not be at Saturday or Sunday'
      }

      
      const { rows } = await query('SELECT * FROM cars WHERE id = $1', [id]);
      const car = rows[0];
      const { rows: log } = await query(`SELECT * FROM bookinglog WHERE serialnumber = '${car.serialnumber}' ORDER BY month DESC, id DESC LIMIT 1;`);
      if ( log.length ) {
        const carLog = log[0];
        const logDate = new Date(carLog.endday);
        const { rows: column } = await query(`SELECT DATE '${logDate.toISOString()}' + 4 <= DATE '${start.toISOString()}';`);
        const endDayBooking = column[0]['?column?'];
        if (!endDayBooking) {
          const { rows: nextDay } = await query(`SELECT DATE '${logDate.toISOString()}' + 4`)
          throw `Booking is available in ${nextDay[0]['?column?']}`
        }
        
      }
      await query(`UPDATE cars SET isbooking = true, startbookingday = $1, endbookingday = $2 WHERE id = $3 ;`, [dayStart, dayEnd, id]);
      const { sum, daysCount } = await this.calculateCost(dayStart, dayEnd);

      if ( monthEnd > month ||  endYear > startYear) {
        const startOfTheMonth = new Date(`${endYear}-${monthEnd}-01`).toISOString();
        const { rows: columnStart } = await query(`SELECT DATE '${startOfTheMonth}' - DATE '${start.toISOString()}';`);
        const daysInLowerMonth = columnStart[0]['?column?']
        const { rows: columnEnd } = await query(`SELECT DATE '${end.toISOString()}' - DATE '${startOfTheMonth}';`);
        const daysInHigherMonth = columnEnd[0]['?column?']
        await query(`INSERT INTO bookinglog(serialnumber, month, bookingdays, price, endday) VALUES($1, $2, $3, $4, $5);`, [car.serialnumber, month, daysInLowerMonth, 0, startOfTheMonth])
        await query(`INSERT INTO bookinglog(serialnumber, month, bookingdays, price, endday) VALUES($1, $2, $3, $4, $5);`, [car.serialnumber, monthEnd, daysInHigherMonth, 0, dayEnd])
      } else {
        await query(`INSERT INTO bookinglog(serialnumber, month, bookingdays, price, endday) VALUES($1, $2, $3, $4, $5);`, [car.serialnumber, month, daysCount, sum, dayEnd])
      }
      return `Success! You are booking car with serial number - ${car.serialnumber} from ${dayStart} to ${dayEnd}`;

    } catch (e) {
      throw new HttpException({
        error: e,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  async createReport(id: string, month: string) {
    const car = await query('SELECT serialnumber FROM cars WHERE id = $1', [id]);
    const serialNumber = car.rows[0].serialnumber;
    const { rows } = await query('SELECT * FROM bookinglog WHERE serialnumber = $1 AND month = $2;', [serialNumber, month])
    const allDaysBooking = rows.reduce((acc, currentElem) => {
      return acc + currentElem.bookingdays;
    }, 0);
    return {serialNumber, allDaysBooking}
  }

  async bookingReport( month: string ) {
    const { rows: cars } = await query('SELECT * FROM cars');
    const { rows } = await query('SELECT * FROM cars INNER JOIN bookinglog ON bookinglog.serialnumber = cars.serialnumber AND month = $1', [month]);
    const report = {};
    let daysCounter = 0;
    cars.forEach((elem) => {
      const allBookingDays = rows.reduce((previousValue, currentValue) => {
        if (elem.serialnumber === currentValue.serialnumber){
          return Number(previousValue) + Number(currentValue.bookingdays);
        }
        return previousValue;
      }, 0);
      const allDays = (allBookingDays / 30) * 100;
      daysCounter += allDays;
      report[elem.serialnumber] = `Serial Number - ${elem.serialnumber} : % days in booking - ${allDays}%`
    });
    const allPercentDaysBooking = daysCounter / cars.length;
    report['total'] = allPercentDaysBooking;
    return report
  }

}
