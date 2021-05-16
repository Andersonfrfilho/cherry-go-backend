import faker from "faker";

import { StatusEventsTransactions } from "@modules/transactions/enums/StatusTransactionsEvents.enums";
import { TransactionEvent } from "@modules/transactions/infra/typeorm/entities/TransactionEvent";
import { ParametersFactoryDTO } from "@shared/infra/typeorm/dtos/Factory.dto";

class TransactionsEventsFactory {
  public generate({
    quantity = 1,
  }: ParametersFactoryDTO): Omit<TransactionEvent, "id">[] {
    return Array.from(
      { length: quantity },
      (): Omit<TransactionEvent, "id"> => ({
        amount: faker.datatype.number({ precision: 2 }).toString(),
        details: faker.random.words(),
        status: Object.values(StatusEventsTransactions)[
          faker.datatype.number({
            min: 0,
            max: Object.values(StatusEventsTransactions).length - 1,
          })
        ],
      })
    );
  }
}
export { TransactionsEventsFactory };
