import { getConnection, MigrationInterface } from "typeorm";

import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { PhoneFactory } from "@shared/infra/typeorm/factories";

export class CreatePhones1620358650178 implements MigrationInterface {
  public async up(): Promise<void> {
    const users = (await getConnection("seed")
      .getRepository("users")
      .find()) as User[];

    const phoneFactory = new PhoneFactory();

    const phones = phoneFactory.generate({
      quantity: users.length,
    });

    const relationshipUsersPhones = users.map((user, index) => ({
      ...phones[index],
      user_id: user.id,
    }));

    await getConnection("seed")
      .getRepository("phones")
      .save(relationshipUsersPhones);
  }

  public async down(): Promise<void> {
    await getConnection("seed").getRepository("phones").delete({});
  }
}
