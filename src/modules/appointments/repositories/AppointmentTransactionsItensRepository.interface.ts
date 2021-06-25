import { CreateAppointmentsUsersTransactionsRepositoryDTO } from "@modules/appointments/dtos";

export interface AppointmentsUsersTransactionsRepositoryInterface {
  createAppointmentsTransactionsItens(
    data: CreateAppointmentsUsersTransactionsRepositoryDTO
  ): Promise<void>;
}
