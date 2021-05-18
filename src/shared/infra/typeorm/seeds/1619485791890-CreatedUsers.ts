import faker from "faker";
import { getConnection, MigrationInterface } from "typeorm";

import { UsersFactory } from "@shared/infra/typeorm/factories";

export class CreatedUsers1619485791890 implements MigrationInterface {
  public async up(): Promise<void> {
    const user_factory = new UsersFactory();
    const users = user_factory.generate({
      quantity: faker.datatype.number({ min: 3, max: 8 }),
    });
    await getConnection("seed").getRepository("users").save(users);
  }

  public async down(): Promise<void> {
    await getConnection("seed").getRepository("users").delete({});
  }
}
