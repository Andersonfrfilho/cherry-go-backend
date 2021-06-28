import { Hour } from "@modules/accounts/dtos/services/CreateProviderTimesAvailabilityService.dto";

export interface CreateProviderTimesAvailabilityProviderDTO {
  provider_id: string;
  times: Hour[];
}
