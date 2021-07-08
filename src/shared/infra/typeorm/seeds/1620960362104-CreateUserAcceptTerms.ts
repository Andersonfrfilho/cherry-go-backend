import { getConnection, MigrationInterface } from "typeorm";

import { User } from "@modules/accounts/infra/typeorm/entities/User";

export class CreateUserAcceptTerms1620960362104 implements MigrationInterface {
  public async up(): Promise<void> {
    const users = (await getConnection("seeds")
      .getRepository("users")
      .find()) as User[];

    let user_index = 0;
    const related_terms = [];
    while (user_index < users.length) {
      related_terms.push({
        user_id: users[user_index].id,
        accept: true,
      });
      user_index += 1;
    }

    await getConnection("seeds")
      .getRepository("users_terms_accepts")
      .save(related_terms);
  }

  public async down(): Promise<void> {
    await getConnection("seeds")
      .getRepository("users_terms_accepts")
      .delete({});
  }
}
