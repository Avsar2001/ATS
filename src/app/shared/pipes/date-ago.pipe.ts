import { Time } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateAgo'
})
export class DateAgoPipe implements PipeTransform {

  transform(time: Time, date1: any): string {
    let date;
    if (date1 instanceof (Date)) {
      date = date1;
    }
    else {
      date = date1.toDate();
    }

    let yearDiff = new Date().getFullYear() - date.getFullYear();
    let monthDiff = new Date().getMonth() - date.getMonth();
    let dateDiff = new Date().getDate() - date.getDate();
    let hourDiff = new Date().getHours() - time.hours;
    let minuteDiff = new Date().getMinutes() - time.minutes;

    if (yearDiff == 0) {
      if (monthDiff == 0) {
        if (dateDiff == 0) {
          if (hourDiff == 0) {
            return minuteDiff + " " + "Minutes Ago";
          } else {
            return hourDiff + " " + "Hours Ago";
          }
        } else {
          return dateDiff + " " + "Days Ago";
        }
      } else {
        return monthDiff + " " + "Months Ago";
      }
    }
    else {
      return yearDiff + " " + "Years Ago";
    }

  }

}
