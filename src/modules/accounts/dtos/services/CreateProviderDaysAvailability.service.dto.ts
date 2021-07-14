import { DAYS_WEEK_ENUM } from "@modules/accounts/enums/DaysProviders.enum";

export interface CreateProviderDaysAvailabilityServiceDTO {
  provider_id: string;
  days: DAYS_WEEK_ENUM[];
}
