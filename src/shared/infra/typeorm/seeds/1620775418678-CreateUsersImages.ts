import faker from "faker";
import { getConnection, MigrationInterface } from "typeorm";

import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { Image } from "@modules/images/infra/typeorm/entities/Image";
import { ImagesFactory } from "@shared/infra/typeorm/factories";

export class CreateUsersImages1620775418678 implements MigrationInterface {
  public async up(): Promise<void> {
    // const clients = (await getConnection("seeds")
    //   .getRepository("users")
    //   .createQueryBuilder("users")
    //   .leftJoinAndSelect(
    //     "users.types",
    //     "types_users",
    //     "types_users.name = :category_name",
    //     { category_name: "client" }
    //   )
    //   .getMany()) as User[];
    // const providers = await getConnection("seeds")
    //   .getRepository(User)
    //   .createQueryBuilder("users")
    //   .leftJoinAndSelect(
    //     "users.types",
    //     "types_users",
    //     "types_users.name = :category_name",
    //     { category_name: "provider" }
    //   )
    //   .getMany();
    // const images_factory = new ImagesFactory();
    // const clients_images = images_factory.generate({
    //   quantity: clients.length,
    // });
    // const providers_images = images_factory.generate({
    //   quantity: faker.datatype.number({
    //     min: providers.length,
    //     max: providers.length * providers.length,
    //   }),
    // });
    // await getConnection("seeds").getRepository("images").save(clients_images);
    // const clients_images_list = (await getConnection("seeds")
    //   .getRepository("images")
    //   .find()) as Image[];
    // const clients_images_list_content = clients.map((user, index) => ({
    //   ...user,
    //   images: [clients_images_list[index]],
    // }));
    // await getConnection("seeds")
    //   .getRepository(User)
    //   .save(clients_images_list_content);
    // const provider_images_list_saved = (await getConnection("seeds")
    //   .getRepository("images")
    //   .save(providers_images)) as Image[];
    // const provider_images_list = (await getConnection("seeds")
    //   .getRepository("images")
    //   .find(provider_images_list_saved)) as Image[];
    // const relationship_providers_payments_types = providers.map(
    //   (provider, index_provider) => ({
    //     ...provider,
    //     images: Array.from({
    //       length: faker.datatype.number({
    //         min: 1,
    //         max: provider_images_list.length / providers.length,
    //       }),
    //     }).map(
    //       (_, index) =>
    //         provider_images_list[
    //           index +
    //             (provider_images_list.length / provider_images_list.length) *
    //               index_provider
    //         ]
    //     ),
    //   })
    // );
    // await getConnection("seeds")
    //   .getRepository("users")
    //   .save(relationship_providers_payments_types);
  }

  public async down(): Promise<void> {
    // await getConnection("seeds").getRepository("users_images").delete({});
    // await getConnection("seeds").getRepository("images").delete({});
  }
}
