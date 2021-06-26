import { CreateAppointmentsUsersTransactionsRepositoryDTO } from "@modules/appointments/dtos";

export interface AppointmentTransactionsItensRepositoryInterface {
  createAppointmentsTransactionsItens(
    data: CreateAppointmentsUsersTransactionsRepositoryDTO[]
  ): Promise<void>;
}
