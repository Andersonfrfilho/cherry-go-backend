import { getRepository, Repository } from "typeorm";

import { CreateAppointmentTransactionsItensRepositoryDTO } from "@modules/appointments/dtos";
import { AppointmentTransactionsItensRepositoryInterface } from "@modules/appointments/repositories/AppointmentTransactionsItensRepository.interface";
import { Transaction } from "@modules/transactions/infra/typeorm/entities/Transaction";
import { TransactionItem } from "@modules/transactions/infra/typeorm/entities/TransactionItem";

export class AppointmentTransactionsItensRepository
  implements AppointmentTransactionsItensRepositoryInterface {
  private repository: Repository<TransactionItem>;

  constructor() {
    this.repository = getRepository(TransactionItem);
  }
  async createAppointmentsTransactionsItens(
    transaction_items: CreateAppointmentTransactionsItensRepositoryDTO[]
  ): Promise<void> {
    await this.repository.save(transaction_items);
  }
}
