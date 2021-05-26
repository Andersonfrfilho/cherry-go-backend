import { add, differenceInYears, isBefore } from "date-fns";

import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";

class DateFnsProvider implements IDateProvider {
  dateNow(): Date {
    throw new Error("Method not implemented.");
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

export { DateFnsProvider };
