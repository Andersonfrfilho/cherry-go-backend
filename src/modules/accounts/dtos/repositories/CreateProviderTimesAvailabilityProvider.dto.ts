import { ProviderAvailabilityTime } from "@modules/accounts/infra/typeorm/entities/ProviderAvailabilityTime";

export interface CreateProviderTimesAvailabilityProviderDTO {
  provider_id: string;
  times: Partial<ProviderAvailabilityTime>[];
}
