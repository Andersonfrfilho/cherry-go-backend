import { CreateAppointmentRepositoryDTO } from "@modules/appointments/dtos";
import { Appointment } from "@modules/appointments/infra/typeorm/entities/Appointment";

export interface AppointmentsRepositoryInterface {
  create(data: CreateAppointmentRepositoryDTO): Promise<Appointment>;
  delete(id: string): Promise<void>;
}
