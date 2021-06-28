import { DAYS_WEEK } from "@modules/accounts/enums/DaysProviders.enum";

export interface CreateProviderDaysAvailabilityProviderDTO {
  provider_id: string;
  days: DAYS_WEEK[];
}
