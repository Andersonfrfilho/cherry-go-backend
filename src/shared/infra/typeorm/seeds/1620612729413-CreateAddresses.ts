import { getConnection, MigrationInterface } from "typeorm";

import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { Address } from "@modules/addresses/infra/typeorm/entities/Address";
import { AddressesFactory } from "@shared/infra/typeorm/factories";

export class CreateAddresses1620612729413 implements MigrationInterface {
  public async up(): Promise<void> {
    const users = (await getConnection("seeds")
      .getRepository("users")
      .find()) as User[];

    const address_factory = new AddressesFactory();

    const addresses = address_factory.generate({
      quantity: users.length,
    });

    await getConnection("seeds").getRepository("addresses").save(addresses);

    const addresses_list = (await getConnection("seeds")
      .getRepository("addresses")
      .find()) as Address[];

    const relationship_users_addresses = users.map((user, index) => ({
      ...user,
      addresses: [addresses_list[index]],
    }));

    await getConnection("seeds")
      .getRepository(User)
      .save(relationship_users_addresses);
  }

  public async down(): Promise<void> {
    await getConnection("seeds").getRepository("users_addresses").delete({});
    await getConnection("seeds").getRepository("addresses").delete({});
  }
}
