import { getConnection, MigrationInterface } from "typeorm";

import { TypeUser } from "@modules/accounts/infra/typeorm/entities/TypeUser";
import { UsersTypesFactory } from "@shared/infra/typeorm/factories";

export class CreateTypesUsersInsert1622133406328 implements MigrationInterface {
  public async up(): Promise<void> {
    const users_types_factory = new UsersTypesFactory();

    const types = users_types_factory.generate();

    await getConnection("default").getRepository(TypeUser).save(types);
  }

  public async down(): Promise<void> {
    await getConnection("default")
      .getRepository("users_types_users")
      .delete({});
    await getConnection("default").getRepository("types_users").delete({});
  }
}
