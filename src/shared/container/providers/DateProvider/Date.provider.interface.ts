import { Appointment } from "@modules/appointments/infra/typeorm/entities/Appointment";

import {
  AvailableHoursParamsDTO,
  FilterDurationIntervalsParamsDTO,
  FormattedHoursByPeriodParamsDTO,
  FormattedHoursDays,
  FormattedHoursSelected,
  FormattedHoursSelectedByPeriod,
  FormattedUnavailableHoursByDurationParamsDTO,
  Hours,
  Hours_Unavailable,
} from "./dtos/Hours.dto";
import { SubHoursDTO } from "./dtos/SubHours.dto";

export interface DateProviderInterface {
  checkAdulthood(date: Date): boolean;
  addDays(days: number): Date;
  compareIfBefore(start_date: Date, end_date: Date): boolean;
  compareIfAfter(start_date: Date, end_date: Date): boolean;
  compareIfBetween(date: Date, start_date: Date, end_date: Date): boolean;
  compareIfEqual(start_date: Date, end_date: Date): boolean;
  addMinutes(minutes: number): Date;
  dateNow(): Date;
  subHours(data: SubHoursDTO): Date;
  getDay(data: Date): number;
  getHour(data: Date): string;
  getMinute(data: Date): string;
  formattedDateToCompare(hour: string, minute: string): Date;
  reduceHours(hours: Array<Hours>): Array<Hours>;
  availableHours(data: AvailableHoursParamsDTO): Array<Hours>;
  unavailableHours(array_hours: Appointment[]): Hours_Unavailable[];
  filterDurationIntervals(data: FilterDurationIntervalsParamsDTO): Hours[];
  formattedByPeriod(
    data: FormattedHoursByPeriodParamsDTO
  ): FormattedHoursDays[];
  unavailableByDuration(
    data: FormattedUnavailableHoursByDurationParamsDTO
  ): FormattedHoursDays[];
}
