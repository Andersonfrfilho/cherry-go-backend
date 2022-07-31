import { DAYS_WEEK_ENUM } from "@modules/accounts/enums/DaysProviders.enum";
import { ProviderAvailabilityDay } from "@modules/accounts/infra/typeorm/entities/ProviderAvailabilityDay";

export const orderDaysWeek = (
  days_param: ProviderAvailabilityDay[]
): ProviderAvailabilityDay[] => {
  const days_of_week = Object.values(DAYS_WEEK_ENUM);
  const days_formatted = [];
  days_of_week.forEach((day_of_week) => {
    const day_param_found = days_param.find(
      (day_param) => day_param.day.toLowerCase() === day_of_week.toLowerCase()
    );
    days_formatted.push(day_param_found);
  });
  return days_formatted;
};
