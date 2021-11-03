import { Hour } from "@modules/accounts/dtos/services/CreateProviderTimesAvailability.service.dto";

export interface CreateProviderTimesAvailabilityProviderDTO {
  provider_id: string;
  end_hour: string;
  start_hour: string;
}
