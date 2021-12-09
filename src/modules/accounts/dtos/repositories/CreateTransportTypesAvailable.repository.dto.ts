import { DetailsProviderTransportType } from "@modules/accounts/infra/typeorm/entities/ProviderTransportTypes";

export interface transport_types {
  transport_type_id: string;
  amount: number;
  details?: DetailsProviderTransportType;
}
export interface CreateTransportTypesAvailableRepositoryDTO {
  transports_types: Partial<transport_types>[];
  provider_id: string;
}
