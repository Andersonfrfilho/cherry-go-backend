export interface CreateTransportsRepositoryDTO {
  amount: number;
  provider_id: string;
  appointment_id: string;
  transport_type_id: string;
  origin_address_id: string;
  destination_address_id: string;
  confirm: boolean;
  initial_hour: string;
  departure_time: Date;
  arrival_time_destination: Date;
  arrival_time_return: Date;
  return_time: Date;
}
