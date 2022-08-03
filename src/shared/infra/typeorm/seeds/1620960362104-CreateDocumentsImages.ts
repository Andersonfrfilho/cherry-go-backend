import { getConnection, MigrationInterface, Not } from "typeorm";

import { faker } from "@faker-js/faker/locale/pt_BR";
import { USER_DOCUMENT_VALUE_ENUM } from "@modules/accounts/enums/UserDocumentValue.enum";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { Image } from "@modules/images/infra/typeorm/entities/Image";
import { ImagesFactory } from "@shared/infra/typeorm/factories";

export class CreateDocumentsImages1620960362104 implements MigrationInterface {
  public async up(): Promise<void> {
    const users = (await getConnection("seeds")
      .getRepository("users")
      .find({ where: { cpf: Not("00000000000") } })) as User[];

    const images_factory = new ImagesFactory();
    const images_factory_list = images_factory.generate({
      quantity: users.length,
    });
    const images_saves = await getConnection("seeds")
      .getRepository("images")
      .save(images_factory_list);
    const images_list = (await getConnection("seeds")
      .getRepository("images")
      .find(images_saves)) as Image[];
    const document_user_images_front = users.map((user, index) => ({
      user_id: user.id,
      image_id: images_list[index].id,
      value: faker.phone.phoneNumber("###########"),
      description: USER_DOCUMENT_VALUE_ENUM.FRONT,
    }));
    const document_user_images_back = users.map((user, index) => ({
      user_id: user.id,
      image_id: images_list[index].id,
      value: faker.phone.phoneNumber("###########"),
      description: USER_DOCUMENT_VALUE_ENUM.BACK,
    }));
    const document_user_images_self = users.map((user, index) => ({
      user_id: user.id,
      image_id: images_list[index].id,
      value: faker.phone.phoneNumber("###########"),
      description: USER_DOCUMENT_VALUE_ENUM.SELF_DOCUMENT_FRONT,
    }));
    await getConnection("seeds")
      .getRepository("users_documents_images")
      .save([
        ...document_user_images_front,
        ...document_user_images_back,
        ...document_user_images_self,
      ]);
  }

  public async down(): Promise<void> {
    await getConnection("seeds")
      .getRepository("users_documents_images")
      .delete({});
  }
}
