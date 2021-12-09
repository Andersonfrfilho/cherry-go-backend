import { DetailsProviderTransportType } from "@modules/accounts/infra/typeorm/entities/ProviderTransportTypes";

export interface UpdateTransportTypeAvailableRepositoryDTO {
  transport_type_provider_id: string;
  amount: number;
  details?: DetailsProviderTransportType;
}
