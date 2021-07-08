import { CreateAppointmentTransactionsEventsRepositoryRepositoryDTO } from "@modules/appointments/dtos";

export interface AppointmentTransactionsEventsRepositoryInterface {
  createAppointmentsTransactionsItens(
    data: CreateAppointmentTransactionsEventsRepositoryRepositoryDTO
  ): Promise<void>;
}
