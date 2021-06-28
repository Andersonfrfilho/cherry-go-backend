interface transport_types {
  name: string;
  amount: number;
}
export interface CreateTransportTypesAvailableRepositoryDTO {
  transport_types: Partial<transport_types>[];
  provider_id: string;
}
