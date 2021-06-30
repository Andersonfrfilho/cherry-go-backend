import { getConnection, MigrationInterface } from "typeorm";

import {
  UsersTypesFactory,
  TransportsTypesFactory,
  PaymentsTypesFactory,
} from "@shared/infra/typeorm/factories";

export class InsertInfos1622165715932 implements MigrationInterface {
  public async up(): Promise<void> {
    const types_users_found = await getConnection("seed")
      .getRepository("types_users")
      .find();
    const transports_types_found = await getConnection("seed")
      .getRepository("transports_types")
      .find();
    const payments_types_found = await getConnection("seed")
      .getRepository("payments_types")
      .find();

    if (types_users_found.length === 0) {
      const users_types_factory = new UsersTypesFactory();
      const users_types = users_types_factory.generate({
        active: true,
        description: null,
      });
      await getConnection("seed")
        .getRepository("types_users")
        .save(users_types);
    }

    if (transports_types_found.length === 0) {
      const users_transports_types_factory = new TransportsTypesFactory();
      const transports_types = users_transports_types_factory.generate({
        active: true,
        description: null,
      });
      await getConnection("seed")
        .getRepository("transports_types")
        .save(transports_types);
    }

    if (payments_types_found.length === 0) {
      const payments_types_factory = new PaymentsTypesFactory();
      const payments_types = payments_types_factory.generate({
        active: true,
        description: null,
      });
      await getConnection("seed")
        .getRepository("payments_types")
        .save(payments_types);
    }
  }

  public async down(): Promise<void> {
    await getConnection("seed").getRepository("payments_types").delete({});
    await getConnection("seed").getRepository("transports_types").delete({});
    await getConnection("seed").getRepository("types_users").delete({});
  }
}
