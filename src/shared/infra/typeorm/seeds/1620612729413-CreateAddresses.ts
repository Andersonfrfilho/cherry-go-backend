import { getConnection, MigrationInterface, QueryRunner } from "typeorm";

import { Address } from "@modules/accounts/infra/typeorm/entities/Address";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { AddressesFactory } from "@shared/infra/typeorm/factories";

export class CreateAddresses1620612729413 implements MigrationInterface {
  public async up(): Promise<void> {
    const users = (await getConnection("seed")
      .getRepository("users")
      .find()) as User[];

    const addressFactory = new AddressesFactory();

    const addresses = addressFactory.generate({
      quantity: users.length,
    });

    await getConnection("seed").getRepository("addresses").save(addresses);

    const addresses_list = (await getConnection("seed")
      .getRepository("addresses")
      .find()) as Address[];

    const relationshipUsersAddresses = users.map((user, index) => ({
      ...user,
      addresses: [addresses_list[index]],
    }));

    await getConnection("seed")
      .getRepository(User)
      .save(relationshipUsersAddresses);
  }

  public async down(): Promise<void> {
    await getConnection("seed").getRepository("users_addresses").delete({});
    await getConnection("seed").getRepository("addresses").delete({});
  }
}
