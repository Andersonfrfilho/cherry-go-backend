import { CreateAppointmentUsersRepositoryDTO } from "@modules/appointments/dtos";
import { AppointmentUser } from "@modules/appointments/infra/typeorm/entities/AppointmentUser";

export interface AppointmentsUsersRepositoryInterface {
  create(data: CreateAppointmentUsersRepositoryDTO): Promise<AppointmentUser[]>;
  delete(id: string): Promise<void>;
}
