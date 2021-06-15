import { ProviderAvailabilityTime } from "@modules/accounts/infra/typeorm/entities/ProviderAvailabilityTime";

export interface CreateProviderTimesAvailabilityServiceDTO {
  provider_id: string;
  times: ProviderAvailabilityTime[];
}
