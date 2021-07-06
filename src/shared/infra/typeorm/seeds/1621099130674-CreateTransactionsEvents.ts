import faker from "faker";
import { getConnection, MigrationInterface } from "typeorm";

import { PaymentType } from "@modules/appointments/infra/typeorm/entities/PaymentType";
import { StatusTransactionsEnum } from "@modules/transactions/enums";
import { Transaction } from "@modules/transactions/infra/typeorm/entities/Transaction";

export class CreateTransactionsEvents1621099130674
  implements MigrationInterface {
  public async up(): Promise<void> {
    const payments_types = (await getConnection("seeds")
      .getRepository("payments_types")
      .find()) as PaymentType[];

    const transactions = (await getConnection("seeds")
      .getRepository("transactions")
      .find()) as Transaction[];

    let transaction_index = 0;
    const transactions_events = [];
    while (
      transaction_index < transactions.length &&
      !!transactions[transaction_index]
    ) {
      const payment_type_id =
        payments_types[
          faker.datatype.number({
            min: 0,
            max: payments_types.length - 1,
          })
        ].id;
      transactions_events.push({
        transaction_id: transactions[transaction_index].id,
        status: StatusTransactionsEnum.PROGRESS,
        amount: 0,
        payment_type_id,
      });
      transactions_events.push({
        transaction_id: transactions[transaction_index].id,
        status: StatusTransactionsEnum.FINISHED,
        amount: transactions[transaction_index].current_amount,
        payment_type_id,
      });
      transaction_index += 1;
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
