import faker from "faker";
import { getConnection, MigrationInterface } from "typeorm";

import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { Image } from "@modules/images/infra/typeorm/entities/Image";

import { ImagesFactory } from "../factories";

export class CreateDocumentsImages1620960362104 implements MigrationInterface {
  public async up(): Promise<void> {
    const users = (await getConnection("seed")
      .getRepository("users")
      .find()) as User[];

    const imagesFactory = new ImagesFactory();

    const imagesFactoryList = imagesFactory.generate({
      quantity: users.length,
    });

    const images_saves = await getConnection("seed")
      .getRepository("images")
      .save(imagesFactoryList);

    const images_list = (await getConnection("seed")
      .getRepository("images")
      .find(images_saves)) as Image[];

    const documentUserImages = users.map((user, index) => ({
      user_id: user.id,
      image_id: images_list[index].id,
      value: faker.datatype.number({ precision: 2 }).toString(),
    }));

    await getConnection("seed")
      .getRepository("documents_users_images")
      .save(documentUserImages);
  }

  public async down(): Promise<void> {
    await getConnection("seed")
      .getRepository("documents_users_images")
      .delete({});
  }
}
