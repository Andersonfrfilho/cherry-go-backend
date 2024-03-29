import { getConnection, MigrationInterface } from "typeorm";

import { faker } from "@faker-js/faker/locale/pt_BR";
import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { Image } from "@modules/images/infra/typeorm/entities/Image";
import { ImagesFactory } from "@shared/infra/typeorm/factories";

export class CreateUsersImages1620775418678 implements MigrationInterface {
  public async up(): Promise<void> {
    const clients = (await getConnection("seeds")
      .getRepository("users")
      .createQueryBuilder("users")
      .leftJoinAndSelect("users.types", "types")
      .leftJoinAndSelect("types.user_type", "user_type")
      .where("user_type.name like :name", { name: "client" })
      .getMany()) as User[];
    const providers = await getConnection("seeds")
      .getRepository(Provider)
      .createQueryBuilder("users")
      .leftJoinAndSelect("users.types", "types")
      .leftJoinAndSelect("types.user_type", "user_type")
      .where("user_type.name like :name", { name: "provider" })
      .getMany();
    const images_factory = new ImagesFactory();
    const clients_images = images_factory.generate({
      quantity: clients.length,
    });
    const providers_images = images_factory.generate({
      quantity: faker.datatype.number({
        min: providers.length,
        max: providers.length * 2,
      }),
    });
    await getConnection("seeds").getRepository("images").save(clients_images);
    const clients_images_list = (await getConnection("seeds")
      .getRepository("images")
      .find()) as Image[];
    const clients_images_list_content = clients.map((user, index) => ({
      user_id: user.id,
      image_id: clients_images_list[index].id,
    }));
    await getConnection("seeds")
      .getRepository("users_profiles_images")
      .save(clients_images_list_content);
    const provider_images_list_saved = (await getConnection("seeds")
      .getRepository("images")
      .save(providers_images)) as Image[];
    const provider_images_list = (await getConnection("seeds")
      .getRepository("images")
      .find(provider_images_list_saved)) as Image[];
    let related = 0;
    const related_array = [];
    while (related < provider_images_list.length) {
      let related_providers = 0;
      while (
        related_providers < providers.length &&
        related < provider_images_list.length
      ) {
        related_array.push({
          provider_id: providers[related_providers].id,
          image_id: provider_images_list[related].id,
          rating: faker.datatype
            .number({
              min: 0,
              max: 5,
            })
            .toString(),
          position: related.toString(),
        });
        related_providers += 1;
        related += 1;
      }
      related += 1;
    }
    await getConnection("seeds")
      .getRepository("providers_images")
      .save(related_array);
  }

  public async down(): Promise<void> {
    await getConnection("seeds").getRepository("providers_images").delete({});
    await getConnection("seeds")
      .getRepository("users_profiles_images")
      .delete({});
  }
}
