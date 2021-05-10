import { getConnection, MigrationInterface } from "typeorm";

import { Phone } from "@modules/accounts/infra/typeorm/entities/Phone";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { PhonesFactory } from "@shared/infra/typeorm/factories";

export class CreatePhones1620358650178 implements MigrationInterface {
  public async up(): Promise<void> {
    const users = (await getConnection("seed")
      .getRepository("users")
      .find()) as User[];

    const phoneFactory = new PhonesFactory();

    const phones = phoneFactory.generate({
      quantity: users.length,
    });

    await getConnection("seed").getRepository("phones").save(phones);

    const phones_list = (await getConnection("seed")
      .getRepository("phones")
      .find()) as Phone[];

    const relationshipUsersPhones = users.map((user, index) => ({
      ...user,
      phones: [phones_list[index]],
    }));

    await getConnection("seed")
      .getRepository("users")
      .save(relationshipUsersPhones);
  }

  public async down(): Promise<void> {
    await getConnection("seed").getRepository("users_phones").delete({});
    await getConnection("seed").getRepository("phones").delete({});
  }
}
