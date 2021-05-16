import { getConnection, MigrationInterface } from "typeorm";

import { Appointment } from "@modules/appointments/infra/typeorm/entities/Appointments";

import { TransactionsFactory } from "../factories/TransactionsFactory";

export class CreateTransactions1621147024941 implements MigrationInterface {
  public async up(): Promise<void> {
    const transaction_factory = new TransactionsFactory();
    console.log(transaction_factory);
    const appointments = (await getConnection("seed")
      .getRepository("appointments")
      .find()) as Appointment[];

    const transactions_factory_list = transaction_factory.generate({
      quantity: appointments.length,
    });

    await getConnection("seed")
      .getRepository("transactions")
      .save(transactions_factory_list);

    const transactions = await getConnection("seed")
      .getRepository("transactions")
      .find();

    const appointment_transactions = appointments.map((appointment, index) => ({
      ...appointment,
      transactions: [transactions[index]],
    }));

    await getConnection("seed")
      .getRepository(Appointment)
      .save(appointment_transactions);
  }

  public async down(): Promise<void> {
    await getConnection("seed")
      .getRepository("appointments_transactions")
      .delete({});
    await getConnection("seed").getRepository("transactions").delete({});
  }
}
