import { getConnection, MigrationInterface } from "typeorm";

import { TypeUser } from "@modules/accounts/infra/typeorm/entities/TypeUser";
import { User } from "@modules/accounts/infra/typeorm/entities/User";

export class CreateUsersTypes1620665114995 implements MigrationInterface {
  public async up(): Promise<void> {
    const users = (await getConnection("seeds")
      .getRepository("users")
      .find()) as User[];

    const users_types = (await getConnection("seeds")
      .getRepository("types_users")
      .find()) as TypeUser[];

    const number_groups = Math.trunc(users.length / users_types.length);

    const connects = [];

    for (
      let index_type_user = 0;
      index_type_user < users_types.length;
      index_type_user += 1
    ) {
      const array_send = [];
      for (let index_user = 0; index_user < users.length; index_user += 1) {
        if (index_user < number_groups) {
          array_send.push({
            user_id: users[index_user + index_type_user * number_groups],
            user_type_id: users_types[index_type_user].id,
            active: true,
          });
        }
        if (
          users.length % users_types.length !== 0 &&
          index_type_user === users_types.length - 1 &&
          index_user === users.length - 1
        ) {
          array_send.push({
            user_id: users[users.length - 1].id,
            user_type_id: users_types[index_type_user].id,
            active: true,
          });
        }
      }
      connects.push(array_send);
    }
    const relationship_users_types = connects.reduce(
      (accumulator, currentValue) => [...accumulator, ...currentValue]
    );
    await getConnection("seeds")
      .getRepository("users_types_users")
      .save(relationship_users_types);
  }

  public async down(): Promise<void> {
    await getConnection("seeds").getRepository("users_types_users").delete({});
  }
}
