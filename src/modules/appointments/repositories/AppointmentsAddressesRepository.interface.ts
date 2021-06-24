import { CreateAppointmentsAddressesRepositoryDTO } from "@modules/appointments/dtos";

export interface AppointmentsAddressesRepositoryInterface {
  create(data: CreateAppointmentsAddressesRepositoryDTO): Promise<void>;
}
