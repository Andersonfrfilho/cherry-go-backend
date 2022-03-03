import { CreateAppointmentTransactionItemRepositoryDTO } from "@modules/appointments/dtos";

export interface AppointmentTransactionItemRepositoryInterface {
  createAppointmentsTransactionsItens(
    data: CreateAppointmentTransactionItemRepositoryDTO[]
  ): Promise<void>;
}
