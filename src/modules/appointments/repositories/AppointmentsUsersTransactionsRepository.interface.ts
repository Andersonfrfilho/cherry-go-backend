import {
  CreateAppointmentsUsersTransactionsRepositoryDTO,
  UpdatedAppointmentsUsersTransactionsRepositoryDTO,
} from "@modules/appointments/dtos";

export interface AppointmentsUsersTransactionsRepositoryInterface {
  createAppointmentsUsersTransactions(
    data: CreateAppointmentsUsersTransactionsRepositoryDTO
  ): Promise<void>;
  updatedAppointmentsUsersTransactions(
    data: UpdatedAppointmentsUsersTransactionsRepositoryDTO
  ): Promise<void>;
}
