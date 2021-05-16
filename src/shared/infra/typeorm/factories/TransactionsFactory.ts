import faker from "faker";

import { StatusTransactions } from "@modules/transactions/enums/StatusTransactionsEvents.enums";
import { Transaction } from "@modules/transactions/infra/typeorm/entities/Transaction";
import { ParametersFactoryDTO } from "@shared/infra/typeorm/dtos/Factory.dto";

class TransactionsFactory {
  public generate({
    quantity = 1,
  }: ParametersFactoryDTO): Omit<Transaction, "id">[] {
    return Array.from(
      { length: quantity },
      (): Omit<Transaction, "id"> => ({
        discount_amount: faker.datatype.number({ precision: 2 }).toString(),
        increment_amount: faker.datatype.number({ precision: 2 }).toString(),
        original_amount: faker.datatype.number({ precision: 2 }).toString(),
        current_amount: faker.datatype.number({ precision: 2 }).toString(),
        status: Object.values(StatusTransactions)[
          faker.datatype.number({
            min: 0,
            max: Object.values(StatusTransactions).length - 1,
          })
        ],
      })
    );
  }
}
export { TransactionsFactory };
