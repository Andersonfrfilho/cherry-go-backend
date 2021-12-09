import { transport_types } from "../repositories/CreateTransportTypesAvailable.repository.dto";

export interface CreateProviderTransportTypesAvailabilitiesServiceDTO {
  provider_id: string;
  transports_types: Partial<transport_types>[];
}
