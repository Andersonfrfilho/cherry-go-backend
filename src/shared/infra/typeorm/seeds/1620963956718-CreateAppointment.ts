import faker from "faker";
import { getConnection, MigrationInterface } from "typeorm";

import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { AppointmentsFactory } from "@shared/infra/typeorm/factories";

export class CreateAppointment1620963956718 implements MigrationInterface {
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

    const appointmentsFactory = new AppointmentsFactory();

    const imagesFactoryList = appointmentsFactory.generate({
      quantity: faker.datatype.number({
        min: clients.length,
        max: clients.length * 2,
      }),
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
