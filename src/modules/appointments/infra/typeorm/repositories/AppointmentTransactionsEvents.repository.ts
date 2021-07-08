import { getRepository, Repository } from "typeorm";

import { CreateAppointmentTransactionsEventsRepositoryRepositoryDTO } from "@modules/appointments/dtos";
import { AppointmentTransactionsEventsRepositoryInterface } from "@modules/appointments/repositories/AppointmentTransactionsEventsRepository.interface";
import { TransactionEvent } from "@modules/transactions/infra/typeorm/entities/TransactionEvent";

export class AppointmentTransactionsEventsRepository
  implements AppointmentTransactionsEventsRepositoryInterface {
  private repository: Repository<TransactionEvent>;

  constructor() {
    this.repository = getRepository(TransactionEvent);
  }
  async createAppointmentsTransactionsItens({
    transaction_id,
    status,
    amount,
    details,
    payment_type_id,
  }: CreateAppointmentTransactionsEventsRepositoryRepositoryDTO): Promise<void> {
    await this.repository.save({
      transaction_id,
      status,
      amount,
      details,
      payment_type_id,
    });
  }
}
