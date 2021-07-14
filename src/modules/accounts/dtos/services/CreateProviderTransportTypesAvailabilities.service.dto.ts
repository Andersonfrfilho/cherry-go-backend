import { TransportType } from "@modules/transports/infra/typeorm/entities/TransportType";

export interface CreateProviderTransportTypesAvailabilitiesServiceDTO {
  provider_id: string;
  transport_types: Partial<TransportType>[];
}
