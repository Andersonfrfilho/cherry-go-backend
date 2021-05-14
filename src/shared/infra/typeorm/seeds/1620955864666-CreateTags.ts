import { getConnection, MigrationInterface, QueryRunner } from "typeorm";

import { Service } from "@modules/accounts/infra/typeorm/entities/Services";
import { Image } from "@modules/images/infra/typeorm/entities/Image";
import { ImagesFactory, TagsFactory } from "@shared/infra/typeorm/factories";
import randomNumbers from "@utils/randomNumbers";

export class CreateTags1620955864666 implements MigrationInterface {
  public async up(): Promise<void> {
    const services = (await getConnection("seed")
      .getRepository("services")
      .find()) as Service[];

    const tagsFactory = new TagsFactory();
    const imagesFactory = new ImagesFactory();

    const tagsFactoryList = tagsFactory.generate({
      quantity: randomNumbers({
        min: services.length,
        max: services.length * 2,
      }),
    });

    const imagesFactoryList = imagesFactory.generate({
      quantity: tagsFactoryList.length,
    });

    const images = await getConnection("seed")
      .getRepository("images")
      .save(imagesFactoryList);

    const images_list = (await getConnection("seed")
      .getRepository("images")
      .find(images)) as Image[];

    const images_tags = tagsFactoryList.map((tag, index) => ({
      ...tag,
      image_id: images_list[index].id,
    }));

    await getConnection("seed").getRepository("tags").save(images_tags);

    const tags = await getConnection("seed").getRepository("tags").find();

    const services_tags = services.map((service, index) => ({
      ...service,
      tags: Array.from({
        length: randomNumbers({
          min: 1,
          max: tags.length,
        }),
      }).map((_, index) => tags[index]),
    }));

    await getConnection("seed").getRepository("services").save(services_tags);
  }

  public async down(): Promise<void> {
    await getConnection("seed").getRepository("services_tags").delete({});
    await getConnection("seed").getRepository("tags").delete({});
  }
}
