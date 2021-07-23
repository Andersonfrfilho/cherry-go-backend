import faker from "faker";

import { STATUS_TRANSACTION_ENUM } from "@modules/transactions/enums/StatusTransactionsEvents.enums";
import { Transaction } from "@modules/transactions/infra/typeorm/entities/Transaction";
import { ParametersFactoryDTO } from "@shared/infra/typeorm/dtos/Factory.dto";

interface CreateTagsFactoryDTO
  extends Partial<Transaction>,
    ParametersFactoryDTO {}
export class TransactionsFactory {
  public generate({
    quantity = 1,
    id,
    current_amount,
    original_amount,
    discount_amount,
    increment_amount,
    status,
  }: CreateTagsFactoryDTO): Partial<Transaction>[] {
    return Array.from(
      { length: quantity },
      (): Partial<Transaction> => ({
        id: id ? faker.datatype.uuid() : undefined,
        current_amount: current_amount || faker.datatype.number(),
        original_amount: original_amount || faker.datatype.number(),
        discount_amount: discount_amount || faker.datatype.number(),
        increment_amount: increment_amount || faker.datatype.number(),
        status: status || STATUS_TRANSACTION_ENUM.PROGRESS,
      })
    );
  }
}
