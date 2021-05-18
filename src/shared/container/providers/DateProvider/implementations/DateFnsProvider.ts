import { add, differenceInYears } from "date-fns";

import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";

class DateFnsProvider implements IDateProvider {
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
