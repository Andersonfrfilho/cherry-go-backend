import {
  CreateAppointmentsUsersTransactionsRepositoryDTO,
  UpdatedAppointmentsUsersTransactionsRepositoryDTO,
} from "@modules/appointments/dtos";
import { Transaction } from "@modules/transactions/infra/typeorm/entities/Transaction";

export interface AppointmentsUsersTransactionsRepositoryInterface {
  createAppointmentsUsersTransactions(
    data: CreateAppointmentsUsersTransactionsRepositoryDTO
  ): Promise<Transaction>;
  updatedAppointmentsUsersTransactions(
    data: UpdatedAppointmentsUsersTransactionsRepositoryDTO
  ): Promise<void>;
}
