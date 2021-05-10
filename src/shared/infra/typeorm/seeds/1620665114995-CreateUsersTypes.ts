import { getConnection, MigrationInterface, QueryRunner } from "typeorm";

import { TypeUser } from "@modules/accounts/infra/typeorm/entities/TypeUser";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { TypesFactory } from "@shared/infra/typeorm/factories";
import randomNumbers from "@utils/randomNumbers";

export class CreateUsersTypes1620665114995 implements MigrationInterface {
  public async up(): Promise<void> {
    const users = (await getConnection("seed")
      .getRepository("users")
      .find()) as User[];

    const typesFactory = new TypesFactory();

    const types = typesFactory.generate();

    await getConnection("seed").getRepository("types_users").save(types);

    const types_list = (await getConnection("seed")
      .getRepository("types_users")
      .find()) as TypeUser[];

    const relationshipUsersTypes = users.map((user, index) => ({
      ...user,
      types: Array.from({
        length: randomNumbers({ min: 1, max: 3 }),
      }).map((element, index) => types_list[index]),
    }));

    await getConnection("seed")
      .getRepository("users")
      .save(relationshipUsersTypes);
  }

  public async down(): Promise<void> {
    await getConnection("seed").getRepository("users_types_users").delete({});
    await getConnection("seed").getRepository("types_users").delete({});
  }
}
