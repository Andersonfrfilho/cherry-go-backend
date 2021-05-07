import { getConnection, MigrationInterface, QueryRunner } from "typeorm";

import { UserFactory } from "@shared/infra/typeorm/factories";
import randomNumbers from "@utils/randomNumbers";

export class created1619485791890 implements MigrationInterface {
  public async up(): Promise<void> {
    const userFactory = new UserFactory();
    const users = userFactory.generate({
      quantity: randomNumbers({ min: 1, max: 10 }),
    });
    await getConnection("seed").getRepository("users").save(users);
  }

  public async down(): Promise<void> {
    await getConnection("seed").getRepository("users").delete({});
  }
}
