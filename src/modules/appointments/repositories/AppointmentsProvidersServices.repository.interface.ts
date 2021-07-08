import { CreateAppointmentProvidersServiceRepositoryDTO } from "@modules/appointments/dtos";

export interface AppointmentsProvidersServicesRepositoryInterface {
  create(data: CreateAppointmentProvidersServiceRepositoryDTO): Promise<void>;
}
