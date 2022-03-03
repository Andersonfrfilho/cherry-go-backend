import { CreateAppointmentRepositoryDTO } from "@modules/appointments/dtos";
import { Appointment } from "@modules/appointments/infra/typeorm/entities/Appointment";

import { TransactionCreateAppointmentRepositoryDTO } from "../dtos/repositories/TransactionCreateAppointment.repository.dto";

export interface AppointmentsRepositoryInterface {
  create(data: CreateAppointmentRepositoryDTO): Promise<Appointment>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Appointment>;
  transactionCreate(
    data: TransactionCreateAppointmentRepositoryDTO
  ): Promise<Appointment>;
}
