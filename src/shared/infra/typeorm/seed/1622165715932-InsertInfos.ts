import { getConnection, MigrationInterface } from "typeorm";

import {
  UsersTypesFactory,
  TransportsTypesFactory,
  PaymentsTypesFactory,
} from "@shared/infra/typeorm/factories";

export class InsertInfos1622165715932 implements MigrationInterface {
  public async up(): Promise<void> {
    const users_types_factory = new UsersTypesFactory();
    const users_transports_types_factory = new TransportsTypesFactory();
    const payments_types_factory = new PaymentsTypesFactory();

    const users_types = users_types_factory.generate({
      active: true,
      description: null,
    });
    const transports_types = users_transports_types_factory.generate({
      active: true,
      description: null,
    });
    const payments_types = payments_types_factory.generate({
      active: true,
      description: null,
    });

    await getConnection("seed").getRepository("types_users").save(users_types);
    await getConnection("seed")
      .getRepository("transports_types")
      .save(transports_types);
    await getConnection("seed")
      .getRepository("payments_types")
      .save(payments_types);
  }

  public async down(): Promise<void> {
    await getConnection("seed").getRepository("payments_types").delete({});
    await getConnection("seed").getRepository("transports_types").delete({});
    await getConnection("seed").getRepository("types_users").delete({});
  }
}
