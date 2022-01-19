import { isAfter, isBefore, isEqual } from "date-fns";

import { DateProviderInterface } from "@shared/container/providers/DateProvider/Date.provider.interface";
import { formattedDateToCompare } from "@utils/formattedHourToCompare";

function compareIfBefore(start_date: Date, end_date: Date): boolean {
  return isBefore(start_date, end_date);
}

function compareIfEqual(start_date: Date, end_date: Date): boolean {
  return isEqual(start_date, end_date);
}

function compareIfAfter(start_date: Date, end_date: Date): boolean {
  return isAfter(end_date, start_date);
}

export function reduceHours(hours: Array<hours>): Array<hours> {
  let clone_hours = hours;
  let index = 0;
  while (index < clone_hours.length) {
    let index_two = index + 1;
    while (index_two > index && index_two < clone_hours.length) {
      const [hour_start, minutes_start] = clone_hours[index].initial_date.split(
        ":"
      );
      const dateStartCompare = formattedDateToCompare(
        hour_start,
        minutes_start
      );
      const [hour_end, minutes_end] = clone_hours[index].final_date.split(":");
      const dateEndCompare = formattedDateToCompare(hour_end, minutes_end);
      const [hour_start_other, minutes_start_other] = clone_hours[
        index_two
      ].initial_date.split(":");
      const [hour_final_other, minutes_final_other] = clone_hours[
        index_two
      ].final_date.split(":");
      const dateStartOtherCompare = formattedDateToCompare(
        hour_start_other,
        minutes_start_other
      );
      const dateEndOtherCompare = formattedDateToCompare(
        hour_final_other,
        minutes_final_other
      );

      if (clone_hours[index].day === clone_hours[index_two].day) {
        if (compareIfBefore(dateStartCompare, dateStartOtherCompare)) {
          if (compareIfEqual(dateStartOtherCompare, dateEndCompare)) {
            clone_hours[index] = {
              ...clone_hours[index],
              final_date: clone_hours[index_two].final_date,
            };
            clone_hours = clone_hours.filter(
              (hourParam, indexParam) => indexParam !== index_two
            );
          }
          if (!compareIfAfter(dateEndCompare, dateEndOtherCompare)) {
            clone_hours[index] = {
              ...clone_hours[index],
              final_date: clone_hours[index_two].final_date,
            };
            clone_hours = clone_hours.filter(
              (hourParam, indexParam) => indexParam !== index_two
            );
          }
        }
      }
      index_two += 1;
    }
    index += 1;
  }

  return clone_hours;
}
