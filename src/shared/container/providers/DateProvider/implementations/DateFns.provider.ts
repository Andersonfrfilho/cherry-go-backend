import {
  add,
  differenceInYears,
  isBefore,
  toDate,
  addMinutes,
  subHours,
  isAfter,
  isEqual,
  getDay,
  getHours,
  getMinutes,
  differenceInMilliseconds,
} from "date-fns";

import { config } from "@config/environment";
import { Appointment } from "@modules/appointments/infra/typeorm/entities/Appointment";
import { DateProviderInterface } from "@shared/container/providers/DateProvider/Date.provider.interface";

import { DAYS_WEEK_DATE } from "../constants/days.constant";
import {
  AvailableHoursParamsDTO,
  FilterDurationIntervalsParamsDTO,
  hours,
  Hours_Unavailable,
} from "../dtos/Hours.dto";
import { SubHoursDTO } from "../dtos/SubHours.dto";

export class DateFnsProvider implements DateProviderInterface {
  getHour(data: Date): string {
    return getHours(data).toString().padStart(2, "0");
  }
  getMinute(data: Date): string {
    return getMinutes(data).toString().padStart(2, "0");
  }
  getDay(data: Date): number {
    return getDay(data);
  }

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

  compareIfBetween(date: Date, start_date: Date, end_date: Date): boolean {
    return isAfter(date, start_date) && isBefore(date, end_date);
  }

  addDays(days: number) {
    return add(new Date(), {
      days,
    });
  }

  formattedDateToCompare(hour: string, minute: string): Date {
    const dateStartCompare = new Date(2000, 0, 1);
    return new Date(
      dateStartCompare.setHours(Number(hour), Number(minute), 0, 0)
    );
  }

  reduceHours(hours: Array<hours>): Array<hours> {
    let clone_hours = hours;
    let index = 0;
    while (index < clone_hours.length) {
      let index_two = index + 1;
      while (index_two > index && index_two < clone_hours.length) {
        const [hour_start, minutes_start] = clone_hours[
          index
        ].initial_date.split(":");
        const dateStartCompare = this.formattedDateToCompare(
          hour_start,
          minutes_start
        );
        const [hour_end, minutes_end] = clone_hours[index].final_date.split(
          ":"
        );
        const dateEndCompare = this.formattedDateToCompare(
          hour_end,
          minutes_end
        );
        const [hour_start_other, minutes_start_other] = clone_hours[
          index_two
        ].initial_date.split(":");
        const [hour_final_other, minutes_final_other] = clone_hours[
          index_two
        ].final_date.split(":");
        const dateStartOtherCompare = this.formattedDateToCompare(
          hour_start_other,
          minutes_start_other
        );
        const dateEndOtherCompare = this.formattedDateToCompare(
          hour_final_other,
          minutes_final_other
        );

        if (clone_hours[index].day === clone_hours[index_two].day) {
          if (this.compareIfBefore(dateStartCompare, dateStartOtherCompare)) {
            if (this.compareIfEqual(dateStartOtherCompare, dateEndCompare)) {
              clone_hours[index] = {
                ...clone_hours[index],
                final_date: clone_hours[index_two].final_date,
              };
              clone_hours = clone_hours.filter(
                (hourParam, indexParam) => indexParam !== index_two
              );
            }
            if (!this.compareIfAfter(dateEndOtherCompare, dateEndCompare)) {
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

  availableHours({
    available_hours,
    unavailable_hours,
  }: AvailableHoursParamsDTO): Array<hours> {
    const clone_hours_available = available_hours;
    const clone_hours_unavailable = unavailable_hours;
    let index_unavailable = 0;
    while (index_unavailable < clone_hours_unavailable.length) {
      const [
        hour_start_unavailable,
        minutes_start_unavailable,
      ] = clone_hours_unavailable[index_unavailable].initial_date.split(":");
      const dateStartUnavailableCompare = this.formattedDateToCompare(
        hour_start_unavailable,
        minutes_start_unavailable
      );
      const [
        hour_final_unavailable,
        minutes_final_unavailable,
      ] = clone_hours_unavailable[index_unavailable].final_date.split(":");
      const dateEndUnavailableCompare = this.formattedDateToCompare(
        hour_final_unavailable,
        minutes_final_unavailable
      );
      const dateStartIndex = clone_hours_available.findIndex(
        (hourParam, indexParam) => {
          const [
            hour_start_available,
            minutes_start_available,
          ] = hourParam.initial_date.split(":");
          const dateStartAvailableCompare = this.formattedDateToCompare(
            hour_start_available,
            minutes_start_available
          );
          return (
            this.compareIfBefore(
              dateEndUnavailableCompare,
              dateStartAvailableCompare
            ) &&
            hourParam.day === clone_hours_unavailable[index_unavailable].day
          );
        }
      );

      if (dateStartIndex !== -1) {
        const [
          hour_start_available_between,
          minutes_start_available_between,
        ] = clone_hours_available[dateStartIndex].initial_date.split(":");
        const dateStartAvailableBetweenCompare = this.formattedDateToCompare(
          hour_start_available_between,
          minutes_start_available_between
        );
        const [
          hour_end_available_between,
          minutes_end_available_between,
        ] = clone_hours_available[dateStartIndex].final_date.split(":");
        const dateEndAvailableBetweenCompare = this.formattedDateToCompare(
          hour_end_available_between,
          minutes_end_available_between
        );

        const between_start = this.compareIfBetween(
          dateEndUnavailableCompare,
          dateStartAvailableBetweenCompare,
          dateEndAvailableBetweenCompare
        );

        if (between_start) {
          clone_hours_available[dateStartIndex].initial_date =
            clone_hours_unavailable[index_unavailable].final_date;
        }
      }

      const dateEndIndex = clone_hours_available.findIndex((hourParam) => {
        const [
          hour_final_available,
          minutes_final_available,
        ] = hourParam.final_date.split(":");
        const dateEndAvailableCompare = this.formattedDateToCompare(
          hour_final_available,
          minutes_final_available
        );

        return (
          this.compareIfBefore(
            dateStartUnavailableCompare,
            dateEndAvailableCompare
          ) && hourParam.day === clone_hours_unavailable[index_unavailable].day
        );
      });

      if (dateEndIndex !== -1) {
        const [
          hour_start_available_between_two,
          minutes_start_available_between_two,
        ] = clone_hours_available[dateEndIndex].initial_date.split(":");
        const dateStartAvailableBetweenCompareTwo = this.formattedDateToCompare(
          hour_start_available_between_two,
          minutes_start_available_between_two
        );
        const [
          hour_end_available_between_two,
          minutes_end_available_between_two,
        ] = clone_hours_available[dateEndIndex].final_date.split(":");
        const dateEndAvailableBetweenCompareTwo = this.formattedDateToCompare(
          hour_end_available_between_two,
          minutes_end_available_between_two
        );

        const between_end = this.compareIfBetween(
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

  unavailableHours(array_hours: Appointment[]) {
    const tomorrow_add_hour = {
      day: "",
      hours: "00",
      minutes: "00",
    };
    const day = this.getDay(this.dateNow());
    const tomorrow = this.getDay(this.addDays(1));
    return array_hours
      .filter(
        (appointment) =>
          DAYS_WEEK_DATE[
            this.getDay(appointment.initial_date)
          ].toLowerCase() === DAYS_WEEK_DATE[`${day}`].toLowerCase() ||
          DAYS_WEEK_DATE[
            this.getDay(appointment.initial_date)
          ].toLowerCase() === DAYS_WEEK_DATE[`${tomorrow}`].toLowerCase()
      )
      .map((appointment) => {
        if (
          Number(this.getHour(appointment.final_date)) +
            config.providers.post_appointment_time >
          24
        ) {
          tomorrow_add_hour.day = DAYS_WEEK_DATE[
            this.getDay(appointment.initial_date)
          ].toLowerCase();
          tomorrow_add_hour.hours = (
            Number(this.getHour(appointment.final_date)) +
            config.providers.post_appointment_time -
            24
          )
            .toString()
            .padStart(2, "0");
          tomorrow_add_hour.minutes = this.getMinute(appointment.final_date);
        }
        if (
          !!tomorrow_add_hour.day &&
          !!tomorrow_add_hour.day.toLowerCase() ===
            DAYS_WEEK_DATE[this.getDay(appointment.initial_date)].toLowerCase()
        ) {
          return {
            appointment_id: null,
            initial_date: `00:00`,
            final_date: `${tomorrow_add_hour.hours}:${tomorrow_add_hour.minutes}`,
            day: DAYS_WEEK_DATE[this.getDay(appointment.initial_date)],
          };
        }
        return {
          appointment_id: appointment.id,
          initial_date: `${this.getHour(
            appointment.initial_date
          )}:${this.getMinute(appointment.initial_date)}`,
          final_date: `${(
            Number(this.getHour(appointment.final_date)) +
            config.providers.post_appointment_time
          )
            .toString()
            .padStart(2, "0")}:${this.getMinute(appointment.final_date)}`,
          day: DAYS_WEEK_DATE[this.getDay(appointment.initial_date)],
        };
      });
  }
  filterDurationIntervals({
    hoursParam,
    duration,
  }: FilterDurationIntervalsParamsDTO): hours[] {
    return hoursParam.filter((hour) => {
      const [
        hour_start_available,
        minutes_start_available,
      ] = hour.initial_date.split(":");
      const startHour = this.formattedDateToCompare(
        hour_start_available,
        minutes_start_available
      );
      const [
        hour_final_available,
        minutes_final_available,
      ] = hour.final_date.split(":");
      const endHour = this.formattedDateToCompare(
        hour_final_available,
        minutes_final_available
      );

      return differenceInMilliseconds(endHour, startHour) >= duration;
    });
  }
}
