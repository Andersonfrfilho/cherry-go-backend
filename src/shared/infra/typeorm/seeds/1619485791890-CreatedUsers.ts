import { getConnection, MigrationInterface } from "typeorm";

import { faker } from "@faker-js/faker/locale/pt_BR";
import { UsersFactory } from "@shared/infra/typeorm/factories";

export class CreatedUsers1619485791890 implements MigrationInterface {
  public async up(): Promise<void> {
    const types_users = await getConnection("seeds")
      .getRepository("types_users")
      .find();
    const user_factory = new UsersFactory();
    const users = user_factory.generate({
      quantity: types_users.length * types_users.length,
    });
    await getConnection("seeds").getRepository("users").save(users);
  }

  public async down(): Promise<void> {
    await getConnection("seeds").getRepository("users").delete({});
  }
}
