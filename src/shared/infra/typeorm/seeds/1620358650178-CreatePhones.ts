import { getConnection, MigrationInterface } from "typeorm";

import { Phone } from "@modules/accounts/infra/typeorm/entities/Phone";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { PhonesFactory } from "@shared/infra/typeorm/factories";

export class CreatePhones1620358650178 implements MigrationInterface {
  public async up(): Promise<void> {
    const users = (await getConnection("seeds")
      .getRepository("users")
      .find()) as User[];

    const phone_factory = new PhonesFactory();

    const phones = phone_factory.generate({
      quantity: users.length,
    });

    await getConnection("seeds").getRepository("phones").save(phones);

    const phones_list = (await getConnection("seeds")
      .getRepository("phones")
      .find()) as Phone[];

    const relationship_users_phones = users.map((user, index) => ({
      ...user,
      phones: [phones_list[index]],
    }));

    await getConnection("seeds")
      .getRepository(User)
      .save(relationship_users_phones);
  }

  public async down(): Promise<void> {
    await getConnection("seeds").getRepository("users_phones").delete({});
    await getConnection("seeds").getRepository("phones").delete({});
  }
}
