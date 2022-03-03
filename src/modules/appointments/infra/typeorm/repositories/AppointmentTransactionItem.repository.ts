import { getRepository, Repository } from "typeorm";

import { CreateAppointmentTransactionItemRepositoryDTO } from "@modules/appointments/dtos";
import { AppointmentTransactionItemRepositoryInterface } from "@modules/appointments/repositories/AppointmentTransactionItem.repository.interface";
import { TransactionItem } from "@modules/transactions/infra/typeorm/entities/TransactionItem";

export class AppointmentTransactionItemRepository
  implements AppointmentTransactionItemRepositoryInterface
{
  private repository: Repository<TransactionItem>;

  constructor() {
    this.repository = getRepository(TransactionItem);
  }
  async createAppointmentsTransactionsItens(
    transaction_items: CreateAppointmentTransactionItemRepositoryDTO[]
  ): Promise<void> {
    await this.repository.save(transaction_items);
  }
}
