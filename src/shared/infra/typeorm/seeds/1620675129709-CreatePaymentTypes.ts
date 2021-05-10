import { getConnection, MigrationInterface, QueryRunner } from "typeorm";

import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { AppointmentsFactory } from "@shared/infra/typeorm/factories";
import randomNumbers from "@utils/randomNumbers";

export class CreatePaymentTypes1620675129709 implements MigrationInterface {
  public async up(): Promise<void> {
    const users_providers = (await getConnection("seed")
      .getRepository("users")
      .find({ where: { types: { name: "PROVIDER" } } })) as User[];
    const users_clients = (await getConnection("seed")
      .getRepository("users")
      .find({ where: { types: { name: "CLIENT" } } })) as User[];

    const appointmentFactory = new AppointmentsFactory();

    const appointments = appointmentFactory.generate({
      quantity: randomNumbers({ min: 1, max: 20 }),
    });

    await getConnection("seed")
      .getRepository("appointments")
      .save(appointments);
  }

  public async down(): Promise<void> {
    await getConnection("seed").getRepository("appointments").delete({});
  }
}
