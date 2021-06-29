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

    let related = 0;
    const related_array = [];
    while (related < users.length && users_types.length !== 0) {
      let related_types = 0;
      while (related_types < users_types.length) {
        if (related <= users_types.length * users_types.length) {
          related_array.push({
            user_id: users[related].id,
            user_type_id: users_types[related_types].id,
            active: true,
          });
          related += 1;
        }
        if (
          related > users_types.length * users_types.length &&
          related <=
            users_types.length * users_types.length + users_types.length
        ) {
          const data = users_types
            .filter((_, index) => index !== users_types.length - 1)
            .map((user_type) => ({
              user_id: users[related].id,
              user_type_id: user_type.id,
              active: true,
            }));
          related_array.push(...data);
          related += 1;
        }
        if (
          related < users.length &&
          related > users_types.length * users_types.length + users_types.length
        ) {
          const data = users_types.map((user_type) => ({
            user_id: users[related].id,
            user_type_id: user_type.id,
            active: true,
          }));
          related_array.push(...data);
          related += 1;
        }
        related_types += 1;
      }
    }

    await getConnection("seeds")
      .getRepository("users_types_users")
      .save(related_array);
  }

  public async down(): Promise<void> {
    await getConnection("seeds").getRepository("users_types_users").delete({});
    await getConnection("seeds").getRepository("types_users").delete({});
  }
}
