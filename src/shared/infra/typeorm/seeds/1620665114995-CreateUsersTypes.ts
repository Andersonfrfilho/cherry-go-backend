import faker from "faker";
import { getConnection, MigrationInterface } from "typeorm";

import { TypeUser } from "@modules/accounts/infra/typeorm/entities/TypeUser";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { UsersTypesFactory } from "@shared/infra/typeorm/factories";

export class CreateUsersTypes1620665114995 implements MigrationInterface {
  public async up(): Promise<void> {
    const users = (await getConnection("seed")
      .getRepository("users")
      .find()) as User[];

    const users_types_factory = new UsersTypesFactory();

    const types = users_types_factory.generate();

    await getConnection("seed").getRepository("types_users").save(types);

    const types_list = (await getConnection("seed")
      .getRepository("types_users")
      .find()) as TypeUser[];

    const relationship_users_types = users
      .map((user) =>
        Array.from({
          length: faker.datatype.number({ min: 1, max: types_list.length }),
        }).map((_, index) => ({
          user_type_id: types_list[index].id,
          user_id: user.id,
        }))
      )
      .reduce((accumulator, currentValue) => [...accumulator, ...currentValue]);

    await getConnection("seed")
      .getRepository("users_types_users")
      .save(relationship_users_types);
  }

  public async down(): Promise<void> {
    await getConnection("seed").getRepository("users_types_users").delete({});
    await getConnection("seed").getRepository("types_users").delete({});
  }
}
