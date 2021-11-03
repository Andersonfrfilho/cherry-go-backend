import { ProviderAvailabilityTime } from "../infra/typeorm/entities/ProviderAvailabilityTime";

export interface ProvidersAvailabilityTimeRepositoryInterface {
  findById(id: string): Promise<ProviderAvailabilityTime>;
}
