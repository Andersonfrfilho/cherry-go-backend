export type Hours_Unavailable = {
  appointment_id: string;
  initial_date: string;
  final_date: string;
  day: any;
};

export type hours = {
  appointment_id?: string;
  hour_id?: string;
  initial_date: string;
  final_date: string;
  day: string;
};

export interface AvailableHoursParamsDTO {
  available_hours: Array<hours>;
  unavailable_hours: Array<hours>;
}

export interface FilterDurationIntervalsParamsDTO {
  hours_param: hours[];
  duration: number;
}

export interface FormattedHoursByPeriodParamsDTO {
  hours_param: hours[];
  days: string[];
}

export interface FormattedHoursSelected {
  hour: string;
  selected: boolean;
  day: string;
  available: boolean;
}
