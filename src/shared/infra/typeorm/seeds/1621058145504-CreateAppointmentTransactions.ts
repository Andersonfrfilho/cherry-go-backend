import faker from "faker";
import { getConnection, MigrationInterface } from "typeorm";

import { Appointment } from "@modules/appointments/infra/typeorm/entities/Appointment";
import {
  ITENS_TYPES_TRANSACTIONS_ENUM,
  STATUS_TRANSACTION_ENUM,
} from "@modules/transactions/enums";
import { Transaction } from "@modules/transactions/infra/typeorm/entities/Transaction";

export class CreateAppointmentTransactions1621058145504
  implements MigrationInterface {
  public async up(): Promise<void> {
    const appointments = (await getConnection("seeds")
      .getRepository(Appointment)
      .createQueryBuilder("appointments")
      .leftJoinAndSelect("appointments.clients", "clients")
      .leftJoinAndSelect("clients.client", "client")
      .leftJoinAndSelect("appointments.providers", "providers")
      .leftJoinAndSelect("providers.provider", "provider")
      .leftJoinAndSelect("provider.services", "services")
      .leftJoinAndSelect("appointments.transports", "transports")
      .getMany()) as Appointment[];

    const related_appointment_transactions = [];

    let appointment_index = 0;
    while (appointment_index < appointments.length) {
      related_appointment_transactions.push({
        appointment_id: appointments[appointment_index].id,
        client_id: appointments[appointment_index].clients[0].client.id,
        status: STATUS_TRANSACTION_ENUM.PROGRESS,
        current_amount: 0,
        original_amount: 0,
        increment_amount: 0,
        discount_amount: 0,
      });
      appointment_index += 1;
    }

    const transactions = (await getConnection("seeds")
      .getRepository("transactions")
      .save(related_appointment_transactions)) as Transaction[];

    const related_appointment_transactions_itens = [];

    appointment_index = 0;
    while (appointment_index < appointments.length) {
      let service_index = 0;
      let original_amount_total = 0;
      let increment_amount_total = 0;
      let discount_amount_total = 0;
      while (
        service_index <
        appointments[appointment_index].providers[0].provider.services.length
      ) {
        const increment_amount = faker.datatype.number({
          min: 0,
          max:
            appointments[appointment_index].providers[0].provider.services[
              service_index
            ].amount * 0.1,
        });

        const discount_amount = faker.datatype.number({
          min: 0,
          max:
            appointments[appointment_index].providers[0].provider.services[
              service_index
            ].amount * 0.25,
        });

        original_amount_total += Number(
          appointments[appointment_index].providers[0].provider.services[
            service_index
          ].amount
        );
        increment_amount_total += increment_amount;
        discount_amount_total += discount_amount;

        related_appointment_transactions_itens.push({
          transaction_id: transactions[appointment_index].id,
          elements:
            appointments[appointment_index].providers[0].provider.services[
              service_index
            ],
          reference_key:
            appointments[appointment_index].providers[0].provider.services[
              service_index
            ].id,
          type: ITENS_TYPES_TRANSACTIONS_ENUM.SERVICE,
          increment_amount,
          discount_amount,
          amount:
            appointments[appointment_index].providers[0].provider.services[
              service_index
            ].amount,
        });
        service_index += 1;
      }
      const current_amount =
        original_amount_total + increment_amount_total - discount_amount_total;

      transactions[appointment_index].current_amount = current_amount;
      transactions[appointment_index].original_amount = original_amount_total;
      transactions[appointment_index].increment_amount = increment_amount_total;
      transactions[appointment_index].discount_amount = discount_amount_total;
      transactions[appointment_index].status = STATUS_TRANSACTION_ENUM.PROGRESS;

      appointment_index += 1;
    }

    await getConnection("seeds")
      .getRepository("transactions_itens")
      .save(related_appointment_transactions_itens);

    await getConnection("seeds")
      .getRepository("transactions")
      .save(transactions);
  }

  public async down(): Promise<void> {
    await getConnection("seeds").getRepository("transactions_itens").delete({});
    await getConnection("seeds").getRepository("transactions").delete({});
  }
}
