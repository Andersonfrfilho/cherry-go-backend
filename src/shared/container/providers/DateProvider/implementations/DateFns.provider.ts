import {
  add,
  differenceInYears,
  isBefore,
  toDate,
  addMinutes,
  subHours,
  isAfter,
  isEqual,
} from "date-fns";

import { DateProviderInterface } from "@shared/container/providers/DateProvider/Date.provider.interface";

import { SubHoursDTO } from "../dtos/SubHours.dto";

export class DateFnsProvider implements DateProviderInterface {
  compareIfEqual(start_date: Date, end_date: Date): boolean {
    return isEqual(start_date, end_date);
  }
  compareIfAfter(start_date: Date, end_date: Date): boolean {
    return isAfter(start_date, end_date);
  }
  subHours({ date, hours }: SubHoursDTO): Date {
    return subHours(date, hours);
  }
  addMinutes(minutes: number): Date {
    return addMinutes(new Date(), minutes);
  }

  dateNow(): Date {
    return toDate(new Date());
  }

  compareIfBefore(start_date: Date, end_date: Date): boolean {
    return isBefore(start_date, end_date);
  }

  checkAdulthood(date: Date): boolean {
    return differenceInYears(new Date(), date) > 18;
  }

  addDays(days: number) {
    return add(new Date(), {
      days,
    });
  }
}
