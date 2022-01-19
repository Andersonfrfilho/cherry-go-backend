import { isAfter, isBefore } from "date-fns";

import { formattedDateToCompare } from "./formattedHourToCompare";

type hours = {
  appointment_id?: string;
  hour_id?: string;
  initial_date: string;
  final_date: string;
  day: string;
};

function compareIfBetween(
  date: Date,
  start_date: Date,
  end_date: Date
): boolean {
  return isAfter(date, start_date) && isBefore(date, end_date);
}

export function hoursAvailables(
  hours_available: Array<hours>,
  hours_unavailable: Array<hours>
): Array<hours> {
  const clone_hours_available = hours_available;
  const clone_hours_unavailable = hours_unavailable;
  const new_hours_available = [];
  let index_unavailable = 0;
  while (index_unavailable < clone_hours_unavailable.length) {
    console.log(clone_hours_unavailable[index_unavailable]);
    const [
      hour_start_unavailable,
      minutes_start_unavailable,
    ] = clone_hours_unavailable[index_unavailable].initial_date.split(":");
    const dateStartUnavailableCompare = formattedDateToCompare(
      hour_start_unavailable,
      minutes_start_unavailable
    );
    const [
      hour_final_unavailable,
      minutes_final_unavailable,
    ] = clone_hours_unavailable[index_unavailable].final_date.split(":");
    const dateEndUnavailableCompare = formattedDateToCompare(
      hour_final_unavailable,
      minutes_final_unavailable
    );
    const dateStartIndex = clone_hours_available.findIndex(
      (hourParam, indexParam) => {
        const [
          hour_start_available,
          minutes_start_available,
        ] = hourParam.initial_date.split(":");
        const dateStartAvailableCompare = formattedDateToCompare(
          hour_start_available,
          minutes_start_available
        );
        return (
          compareIfBefore(
            dateEndUnavailableCompare,
            dateStartAvailableCompare
          ) && hourParam.day === clone_hours_unavailable[index_unavailable].day
        );
      }
    );

    if (dateStartIndex != -1) {
      const [
        hour_start_available_between,
        minutes_start_available_between,
      ] = clone_hours_available[dateStartIndex].initial_date.split(":");
      const dateStartAvailableBetweenCompare = formattedDateToCompare(
        hour_start_available_between,
        minutes_start_available_between
      );
      const [
        hour_end_available_between,
        minutes_end_available_between,
      ] = clone_hours_available[dateStartIndex].final_date.split(":");
      const dateEndAvailableBetweenCompare = formattedDateToCompare(
        hour_end_available_between,
        minutes_end_available_between
      );
      console.log(
        dateEndUnavailableCompare,
        dateStartAvailableBetweenCompare,
        dateEndAvailableBetweenCompare
      );
      const between_start = compareIfBetween(
        dateEndUnavailableCompare,
        dateStartAvailableBetweenCompare,
        dateEndAvailableBetweenCompare
      );

      if (between_start) {
        clone_hours_available[dateStartIndex].initial_date =
          clone_hours_unavailable[index_unavailable].final_date;
      }
    }

    const dateEndIndex = clone_hours_available.findIndex(
      (hourParam, indexParam) => {
        const [
          hour_final_available,
          minutes_final_available,
        ] = hourParam.final_date.split(":");
        const dateEndAvailableCompare = formattedDateToCompare(
          hour_final_available,
          minutes_final_available
        );
        console.log(dateEndAvailableCompare, dateStartUnavailableCompare);
        return (
          compareIfBefore(
            dateStartUnavailableCompare,
            dateEndAvailableCompare
          ) && hourParam.day === clone_hours_unavailable[index_unavailable].day
        );
      }
    );

    if (dateEndIndex != -1) {
      const [
        hour_start_available_between_two,
        minutes_start_available_between_two,
      ] = clone_hours_available[dateEndIndex].initial_date.split(":");
      const dateStartAvailableBetweenCompareTwo = formattedDateToCompare(
        hour_start_available_between_two,
        minutes_start_available_between_two
      );
      const [
        hour_end_available_between_two,
        minutes_end_available_between_two,
      ] = clone_hours_available[dateEndIndex].final_date.split(":");
      const dateEndAvailableBetweenCompareTwo = formattedDateToCompare(
        hour_end_available_between_two,
        minutes_end_available_between_two
      );
      console.log(
        dateStartUnavailableCompare,
        dateStartAvailableBetweenCompareTwo,
        dateEndAvailableBetweenCompareTwo
      );
      const between_end = compareIfBetween(
        dateStartUnavailableCompare,
        dateStartAvailableBetweenCompareTwo,
        dateEndAvailableBetweenCompareTwo
      );

      if (between_end) {
        clone_hours_available[dateEndIndex].final_date =
          clone_hours_unavailable[index_unavailable].initial_date;
      }
    }
    index_unavailable += 1;
  }
  return clone_hours_available;
}
