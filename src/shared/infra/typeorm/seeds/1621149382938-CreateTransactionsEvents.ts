import faker from "faker";
import { getConnection, MigrationInterface } from "typeorm";

import { PaymentType } from "@modules/appointments/infra/typeorm/entities/PaymentType";
import { Transaction } from "@modules/transactions/infra/typeorm/entities/Transaction";

import { TransactionsEventsFactory } from "../factories/TransactionsEventsFactory";

export class CreateTransactionsEvents1621149382938
  implements MigrationInterface {
  public async up(): Promise<void> {
    const transaction_events_factory = new TransactionsEventsFactory();

    const transactions = (await getConnection("seed")
      .getRepository("transactions")
      .find()) as Transaction[];

    const payments_types = (await getConnection("seed")
      .getRepository("payments_types")
      .find()) as PaymentType[];
    const transactions_events_factories_list = transaction_events_factory.generate(
      {
        quantity: transactions.length,
      }
    );

    const transaction_event_transaction_payment_type = transactions_events_factories_list.map(
      (transaction_event, index) => ({
        ...transaction_event,
        transaction_id: transactions[index],
        payment_type_id:
          payments_types[
            faker.datatype.number({ min: 0, max: payments_types.length - 1 })
          ].id,
      })
    );

    await getConnection("seed")
      .getRepository("transactions_events")
      .save(transaction_event_transaction_payment_type);
  }

  public async down(): Promise<void> {
    await getConnection("seed").getRepository("transactions_events").delete({});
  }
}
