import { getConnection, MigrationInterface } from "typeorm";

import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { Tag } from "@modules/tags/infra/typeorm/entities/Tag";

export class CreateClientTags1620960362104 implements MigrationInterface {
  public async up(): Promise<void> {
    const clients = (await getConnection("seeds")
      .getRepository("users")
      .createQueryBuilder("users")
      .leftJoinAndSelect("users.types", "types")
      .leftJoinAndSelect("types.user_type", "user_type")
      .where("user_type.name like :name", { name: "client" })
      .getMany()) as User[];

    const tags = (await getConnection("seeds")
      .getRepository("tags")
      .find()) as Tag[];

    let clients_index = 0;
    const related_clients_tags = [];
    while (clients_index < clients.length) {
      let tag_index = 0;
      while (tag_index < tags.length) {
        related_clients_tags.push({
          tag_id: tags[tag_index].id,
          client_id: clients[clients_index].id,
        });
        tag_index += 1;
      }
      clients_index += 1;
    }

    await getConnection("seeds")
      .getRepository("clients_tags")
      .save(related_clients_tags);
  }

  public async down(): Promise<void> {
    await getConnection("seeds").getRepository("clients_tags").delete({});
  }
}
