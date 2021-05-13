import { getConnection, MigrationInterface, Not, QueryRunner } from "typeorm";

import { Provider } from "@modules/accounts/infra/typeorm/entities/Providers";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { Image } from "@modules/images/infra/typeorm/entities/Image";
import { usersRoutes } from "@shared/infra/http/routes/users.routes";
import { ImagesFactory } from "@shared/infra/typeorm/factories";
import randomNumbers from "@utils/randomNumbers";

export class CreateUsersImages1620775418678 implements MigrationInterface {
  public async up(): Promise<void> {
    const clients = (await getConnection("seed")
      .getRepository("users")
      .createQueryBuilder("users")
      .leftJoinAndSelect(
        "users.types",
        "types_users",
        "types_users.name = :category_name",
        { category_name: "client" }
      )
      .getMany()) as User[];

    const providers = await getConnection("seed")
      .getRepository(User)
      .createQueryBuilder("users")
      .leftJoinAndSelect(
        "users.types",
        "types_users",
        "types_users.name = :category_name",
        { category_name: "provider" }
      )
      .getMany();

    const imagesFactory = new ImagesFactory();

    const clients_images = imagesFactory.generate({
      quantity: clients.length,
    });

    const providers_images = imagesFactory.generate({
      quantity: randomNumbers({
        min: providers.length,
        max: providers.length * providers.length,
      }),
    });

    await getConnection("seed").getRepository("images").save(clients_images);

    const clients_images_list = (await getConnection("seed")
      .getRepository("images")
      .find()) as Image[];

    const clients_images_list_content = clients.map((user, index) => ({
      ...user,
      images: [clients_images_list[index]],
    }));

    await getConnection("seed")
      .getRepository(User)
      .save(clients_images_list_content);

    const provider_images_list_saved = (await getConnection("seed")
      .getRepository("images")
      .save(providers_images)) as Image[];

    const provider_images_list = (await getConnection("seed")
      .getRepository("images")
      .find(provider_images_list_saved)) as Image[];

    const relationship_providers_payments_types = providers.map(
      (provider, index_provider) => ({
        ...provider,
        images: Array.from({
          length: randomNumbers({
            min: 1,
            max: provider_images_list.length / providers.length,
          }),
        }).map(
          (_, index) =>
            provider_images_list[
              index +
                (provider_images_list.length / provider_images_list.length) *
                  index_provider
            ]
        ),
      })
    );

    await getConnection("seed")
      .getRepository("users")
      .save(relationship_providers_payments_types);
  }

  public async down(): Promise<void> {
    await getConnection("seed").getRepository("users_images").delete({});
    await getConnection("seed").getRepository("images").delete({});
  }
}
