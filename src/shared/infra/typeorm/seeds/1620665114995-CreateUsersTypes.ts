import { getConnection, MigrationInterface, Not } from "typeorm";

import { faker } from "@faker-js/faker/locale/pt_BR";
import { TypeUser } from "@modules/accounts/infra/typeorm/entities/TypeUser";
import { User } from "@modules/accounts/infra/typeorm/entities/User";

function between(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
export class CreateUsersTypes1620665114995 implements MigrationInterface {
  public async up(): Promise<void> {
    const users = (await getConnection("seeds")
      .getRepository("users")
      .find({ where: { cpf: Not("00000000000") } })) as User[];

    const users_types = (await getConnection("seeds")
      .getRepository("types_users")
      .find({ where: { name: Not("admin") } })) as TypeUser[];

    const related_array = users_types
      .map((user_type) => {
        const users_with_types_all = users
          .filter((user, indexUser) => indexUser <= users_types.length - 1)
          .map((user) => ({
            user_id: user.id,
            user_type_id: user_type.id,
            active: true,
            roles: [],
            permissions: [],
          }));

        return [...users_with_types_all];
      })
      .reduce((accumulator, currentValue) => [...accumulator, ...currentValue]);

    const related_array_sorted = users
      .filter((user, indexUser) => indexUser > users_types.length - 1)
      .map((user) => ({
        user_id: user.id,
        user_type_id: users_types[between(0, users_types.length - 1)].id,
        active: true,
        roles: [],
        permissions: [],
      }));

    await getConnection("seeds")
      .getRepository("users_types_users")
      .save([...related_array, ...related_array_sorted]);
  }

  public async down(): Promise<void> {
    await getConnection("seeds").getRepository("users_types_users").delete({});
    await getConnection("seeds").getRepository("types_users").delete({});
  }
}
