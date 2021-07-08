import { CreateAppointmentProvidersRepositoryDTO } from "@modules/appointments/dtos";
import { AppointmentUser } from "@modules/appointments/infra/typeorm/entities/AppointmentUser";

import { AppointmentProvider } from "../infra/typeorm/entities/AppointmentProviders";

export interface AppointmentsProvidersRepositoryInterface {
  create(
    data: CreateAppointmentProvidersRepositoryDTO
  ): Promise<AppointmentProvider[]>;
  delete(id: string): Promise<void>;
}
