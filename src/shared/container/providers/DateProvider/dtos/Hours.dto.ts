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
  days: string[];
}

export interface FormattedHoursSelected {
  hour: string;
  selected: boolean;
  day: string;
  available: boolean;
}

export interface FormattedHoursDays {
  day: string;
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
