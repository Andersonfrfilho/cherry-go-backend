import faker from "faker";
import { getConnection, MigrationInterface } from "typeorm";

import {
  PAYMENT_TYPES_ENUM,
  StatusTransactionsEnum,
} from "@modules/transactions/enums";
import { Transaction } from "@modules/transactions/infra/typeorm/entities/Transaction";

export class CreateTransactionsEvents1621099130674
  implements MigrationInterface {
  public async up(): Promise<void> {
    const transactions = (await getConnection("seeds")
      .getRepository("transactions")
      .find()) as Transaction[];
    const transactions_index = 0;
    const transactions_events = [];
    while (transactions_index < transactions.length) {
      transactions_events.push({
        transactions_id: transactions[transactions_index].id,
        status: StatusTransactionsEnum.PROGRESS,
        amount: 0,
        payment_type_id:
          PAYMENT_TYPES_ENUM[
            Object.keys(PAYMENT_TYPES_ENUM)[
              faker.datatype.number({
                min: 0,
                max: Object.keys(PAYMENT_TYPES_ENUM).length - 1,
              })
            ]
          ],
      });
      transactions_events.push({
        transactions_id: transactions[transactions_index].id,
        status: StatusTransactionsEnum.FINISHED,
        amount: transactions[transactions_index].current_amount,
        payment_type_id:
          PAYMENT_TYPES_ENUM[
            Object.keys(PAYMENT_TYPES_ENUM)[
              faker.datatype.number({
                min: 0,
                max: Object.keys(PAYMENT_TYPES_ENUM).length - 1,
              })
            ]
          ],
      });
    }

    await getConnection("seeds")
      .getRepository("transactions_events")
      .save(transactions_events);
  }

  public async down(): Promise<void> {
    await getConnection("seeds")
      .getRepository("transactions_events")
      .delete({});
  }
}
