import faker from "faker";
import { getConnection, MigrationInterface } from "typeorm";

import { UsersFactory } from "@shared/infra/typeorm/factories";

export class CreatedUsers1619485791890 implements MigrationInterface {
  public async up(): Promise<void> {
    const user_factory = new UsersFactory();
    const users = user_factory.generate({
      quantity: faker.datatype.number({ min: 9, max: 12 }),
    });
    await getConnection("seeds").getRepository("users").save(users);
  }

  public async down(): Promise<void> {
    await getConnection("seeds").getRepository("users").delete({});
  }
}
