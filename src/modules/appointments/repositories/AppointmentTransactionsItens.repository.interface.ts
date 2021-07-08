import { CreateAppointmentTransactionsItensRepositoryDTO } from "@modules/appointments/dtos";

export interface AppointmentTransactionsItensRepositoryInterface {
  createAppointmentsTransactionsItens(
    data: CreateAppointmentTransactionsItensRepositoryDTO[]
  ): Promise<void>;
}
