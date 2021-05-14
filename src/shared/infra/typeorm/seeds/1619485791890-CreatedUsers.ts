import { getConnection, MigrationInterface, QueryRunner } from "typeorm";

import { UsersFactory } from "@shared/infra/typeorm/factories";
import randomNumbers from "@utils/randomNumbers";

export class CreatedUsers1619485791890 implements MigrationInterface {
  public async up(): Promise<void> {
    const userFactory = new UsersFactory();
    const users = userFactory.generate({
      quantity: randomNumbers({ min: 5, max: 10 }),
    });
    await getConnection("seed").getRepository("users").save(users);
  }

  public async down(): Promise<void> {
    await getConnection("seed").getRepository("users").delete({});
  }
}
