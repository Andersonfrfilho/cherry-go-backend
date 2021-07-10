import { CreateAppointmentUsersRepositoryDTO } from "@modules/appointments/dtos";
import { AppointmentClient } from "@modules/appointments/infra/typeorm/entities/AppointmentClient";

export interface AppointmentsUsersRepositoryInterface {
  create(data: CreateAppointmentUsersRepositoryDTO): Promise<AppointmentUser[]>;
  delete(id: string): Promise<void>;
}
