import faker from "faker";

import { StatusTransactionsEnum } from "@modules/transactions/enums/StatusTransactionsEvents.enums";
import { Transaction } from "@modules/transactions/infra/typeorm/entities/Transaction";
import { ParametersFactoryDTO } from "@shared/infra/typeorm/dtos/Factory.dto";

class TransactionsFactory {
  public generate({
    quantity = 1,
  }: ParametersFactoryDTO): Partial<Transaction>[] {
    return Array.from(
      { length: quantity },
      (): Partial<Transaction> => ({
        discount_amount: faker.datatype.number({ precision: 2 }),
        increment_amount: faker.datatype.number({ precision: 2 }),
        original_amount: faker.datatype.number({ precision: 2 }),
        current_amount: faker.datatype.number({ precision: 2 }),
        status: Object.values(StatusTransactionsEnum)[
          faker.datatype.number({
            min: 0,
            max: Object.values(StatusTransactionsEnum).length - 1,
          })
        ],
      })
    );
  }
}
export { TransactionsFactory };
