import { getConnection, MigrationInterface, QueryRunner } from "typeorm";

import { UsersTypesFactory } from "@shared/infra/typeorm/factories";

export class InsertInfos1622165715932 implements MigrationInterface {
  public async up(): Promise<void> {
    const users_types_factory = new UsersTypesFactory();

    const types = users_types_factory.generate();

    await getConnection("seed").getRepository("types_users").save(types);
  }

  public async down(): Promise<void> {
    await getConnection("seed").getRepository("users_types_users").delete({});
    await getConnection("seed").getRepository("types_users").delete({});
  }
}
