import { getRepository, Repository } from "typeorm";

import {
  CreateAppointmentsUsersTransactionsRepositoryDTO,
  UpdatedAppointmentsUsersTransactionsRepositoryDTO,
} from "@modules/appointments/dtos";
import { AppointmentTransactionsItensRepositoryInterface } from "@modules/appointments/repositories/AppointmentTransactionsItensRepository.interface";
import { Transaction } from "@modules/transactions/infra/typeorm/entities/Transaction";

export class AppointmentTransactionsItensRepository
  implements AppointmentTransactionsItensRepositoryInterface {
  private repository: Repository<Transaction>;

  constructor() {
    this.repository = getRepository(Transaction);
  }
  createAppointmentsTransactionsItens(
    data: CreateAppointmentsUsersTransactionsRepositoryDTO[]
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
