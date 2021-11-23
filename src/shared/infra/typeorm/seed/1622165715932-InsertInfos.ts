import { getConnection, MigrationInterface } from "typeorm";

import { GENDERS_ENUM } from "@modules/accounts/enums/GendersUsers.enum";
import { USER_TYPES_ENUM } from "@modules/accounts/enums/UserTypes.enum";
import { TypeUser } from "@modules/accounts/infra/typeorm/entities/TypeUser";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import {
  UsersTypesFactory,
  TransportsTypesFactory,
  PaymentsTypesFactory,
  UsersFactory,
} from "@shared/infra/typeorm/factories";

export class InsertInfos1622165715932 implements MigrationInterface {
  public async up(): Promise<void> {
    const types_users_found = await getConnection("seed")
      .getRepository("types_users")
      .count();
    if (types_users_found === 0) {
      const users_types_factory = new UsersTypesFactory();
      const users_types = users_types_factory.generate({
        active: true,
        description: null,
      });
      await getConnection("seed")
        .getRepository("types_users")
        .save(users_types);
    }
    const transports_types_found = await getConnection("seed")
      .getRepository("transports_types")
      .count();
    if (transports_types_found === 0) {
      const users_transports_types_factory = new TransportsTypesFactory();
      const transports_types = users_transports_types_factory.generate({
        active: true,
        description: null,
      });
      await getConnection("seed")
        .getRepository("transports_types")
        .save(transports_types);
    }
    const payments_types_found = await getConnection("seed")
      .getRepository("payments_types")
      .count();
    if (payments_types_found === 0) {
      const payments_types_factory = new PaymentsTypesFactory();
      const payments_types = payments_types_factory.generate({
        active: true,
        description: null,
      });
      await getConnection("seed")
        .getRepository("payments_types")
        .save(payments_types);
    }
    const user_admin = await getConnection("seed")
      .getRepository(User)
      .findOne({ where: { email: "admin@cherry-go.love" } });
    if (!user_admin) {
      const users_factory = new UsersFactory();
      const [user] = users_factory.generate({
        name: "admin",
        last_name: "root",
        email: "admin@cherry-go.love",
        rg: "000000000",
        cpf: "00000000000",
        birth_date: new Date(2021, 5, 1),
        password_hash: process.env.PASSWORD_USER_SEED_HASH,
        active: true,
        gender: GENDERS_ENUM.male,
        quantity: 1,
      });
      const user_saved = await getConnection("seed")
        .getRepository("users")
        .save(user);

      const types_users = (await getConnection("seed")
        .getRepository("types_users")
        .find()) as TypeUser[];

      const user_type_id_admin = types_users.find(
        (user_type) => user_type.name === USER_TYPES_ENUM.ADMIN
      );

      await getConnection("seed").getRepository("users_types_users").save({
        user_id: user_saved.id,
        user_type_id: user_type_id_admin.id,
        active: true,
      });
    }
  }

  public async down(): Promise<void> {
    await getConnection("seed").getRepository("payments_types").delete({});
    await getConnection("seed").getRepository("transports_types").delete({});
    await getConnection("seed").getRepository("types_users").delete({});
  }
}
