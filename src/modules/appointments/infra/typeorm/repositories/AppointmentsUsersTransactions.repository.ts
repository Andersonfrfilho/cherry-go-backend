import { getRepository, Repository } from "typeorm";

import {
  CreateAppointmentsUsersTransactionsRepositoryDTO,
  UpdatedAppointmentsUsersTransactionsRepositoryDTO,
} from "@modules/appointments/dtos";
import { AppointmentsUsersTransactionsRepositoryInterface } from "@modules/appointments/repositories/AppointmentsUsersTransactions.repository.interface";
import { Transaction } from "@modules/transactions/infra/typeorm/entities/Transaction";

export class AppointmentsUsersTransactionsRepository
  implements AppointmentsUsersTransactionsRepositoryInterface {
  private repository: Repository<Transaction>;

  constructor() {
    this.repository = getRepository(Transaction);
  }
  async createAppointmentsUsersTransactions({
    appointment_id,
    user_id,
    status,
  }: CreateAppointmentsUsersTransactionsRepositoryDTO): Promise<Transaction> {
    return this.repository.save({
      appointment_id,
      user_id,
      status,
    });
  }

  async updatedAppointmentsUsersTransactions({
    transaction_id,
    original_amount,
    current_amount,
    discount_amount,
    increment_amount,
  }: UpdatedAppointmentsUsersTransactionsRepositoryDTO): Promise<void> {
    this.repository.update(transaction_id, {
      original_amount,
      current_amount,
      discount_amount,
      increment_amount,
    });
  }
}
