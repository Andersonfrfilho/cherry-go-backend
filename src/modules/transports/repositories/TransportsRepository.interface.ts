import { CreateAppointmentProvidersRepositoryDTO } from "@modules/appointments/dtos";
import { AppointmentUser } from "@modules/appointments/infra/typeorm/entities/AppointmentUser";

export interface TransportsRepositoryInterface {
  create(data: CreateTransportsRepositoryDTO): Promise<AppointmentProvider[]>;
  findById(id: string): Promise<void>;
}
