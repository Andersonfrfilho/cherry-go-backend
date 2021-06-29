import faker from "faker";
import { getConnection, MigrationInterface } from "typeorm";

import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { Image } from "@modules/images/infra/typeorm/entities/Image";

import { ImagesFactory } from "../factories";

export class CreateDocumentsImages1620960362104 implements MigrationInterface {
  public async up(): Promise<void> {
    // const users = (await getConnection("seeds")
    //   .getRepository("users")
    //   .find()) as User[];
    // const images_factory = new ImagesFactory();
    // const images_factory_list = images_factory.generate({
    //   quantity: users.length,
    // });
    // const images_saves = await getConnection("seeds")
    //   .getRepository("images")
    //   .save(images_factory_list);
    // const images_list = (await getConnection("seeds")
    //   .getRepository("images")
    //   .find(images_saves)) as Image[];
    // const document_user_images = users.map((user, index) => ({
    //   user_id: user.id,
    //   image_id: images_list[index].id,
    //   value: faker.datatype.number({ precision: 2 }).toString(),
    // }));
    // await getConnection("seeds")
    //   .getRepository("documents_users_images")
    //   .save(document_user_images);
  }

  public async down(): Promise<void> {
    // await getConnection("seeds")
    //   .getRepository("documents_users_images")
    //   .delete({});
  }
}
