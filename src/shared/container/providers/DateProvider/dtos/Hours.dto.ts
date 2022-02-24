import { DaysAvailable } from "@modules/accounts/infra/typeorm/entities/ProviderAvailabilityDay";

export type Hours_Unavailable = {
  appointment_id: string;
  initial_date: string;
  final_date: string;
  day: any;
};

export type Hours = {
  appointment_id?: string;
  hour_id?: string;
  initial_date: string;
  final_date: string;
  day: string;
};

export interface AvailableHoursParamsDTO {
  available_hours: Array<Hours>;
  unavailable_hours: Array<Hours>;
}

export interface FilterDurationIntervalsParamsDTO {
  hours_param: Hours[];
  duration: number;
}

export interface FormattedHoursByPeriodParamsDTO {
  hours_param: Hours[];
  days: DaysAvailable[];
  available_hours?: boolean;
}

export interface FormattedHoursSelected {
  hour: string;
  selected: boolean;
  day: string;
  available: boolean;
  date: number;
}

export interface FormattedHoursDays {
  day: DaysAvailable;
  hours: FormattedHoursSelected[];
}

export interface FormattedHoursSelectedByPeriod {
  hour: string;
  selected: boolean;
  day: string;
  available: boolean;
  available_period: boolean;
  time_blocked?: boolean;
}

export interface FormattedUnavailableHoursByDurationParamsDTO {
  days_hours_formatted: FormattedHoursDays[];
  duration: number;
}

export interface DefineHourMinutesSecondsMillisecondsDTO {
  date?: Date;
  hour: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}
