import { CreateAppointmentUsersRepositoryDTO } from "@modules/appointments/dtos";
import { AppointmentClient } from "@modules/appointments/infra/typeorm/entities/AppointmentClient";

export interface AppointmentsUsersRepositoryInterface {
  create(
    data: CreateAppointmentUsersRepositoryDTO
  ): Promise<AppointmentClient[]>;
  delete(id: string): Promise<void>;
}
