import { getConnection, MigrationInterface } from "typeorm";

import { Service } from "@modules/accounts/infra/typeorm/entities/Services";
import { Image } from "@modules/images/infra/typeorm/entities/Image";
import { Tag } from "@modules/tags/infra/typeorm/entities/Tag";
import { ImagesFactory, TagsFactory } from "@shared/infra/typeorm/factories";

export class CreateTags1620955864666 implements MigrationInterface {
  public async up(): Promise<void> {
    const services = (await getConnection("seeds")
      .getRepository("services")
      .find()) as Service[];

    const tags_factory = new TagsFactory();
    const images_factory = new ImagesFactory();

    const tags_factory_list = tags_factory.generate({
      quantity: services.length,
    });

    const images_factory_list = images_factory.generate({
      quantity: tags_factory_list.length,
    });

    const images = await getConnection("seeds")
      .getRepository("images")
      .save(images_factory_list);

    const images_list = (await getConnection("seeds")
      .getRepository("images")
      .find(images)) as Image[];

    const images_tags = tags_factory_list.map((tag, index) => ({
      ...tag,
      image_id: images_list[index].id,
    }));

    await getConnection("seeds").getRepository("tags").save(images_tags);

    const tags = (await getConnection("seeds")
      .getRepository("tags")
      .find()) as Tag[];

    let tag_index = 0;
    const related_tags = [];
    while (tag_index < tags.length && !!tags[tag_index].id) {
      let service_index = 0;
      while (
        service_index < services.length &&
        !!services[service_index].id &&
        !!tags[tag_index].id
      ) {
        related_tags.push({
          service_id: services[service_index].id,
          tag_id: tags[tag_index].id,
        });
        tag_index += 1;
        service_index += 1;
      }
    }

    await getConnection("seeds")
      .getRepository("tags_services")
      .save(related_tags);
  }

  public async down(): Promise<void> {
    await getConnection("seeds").getRepository("services_tags").delete({});
    await getConnection("seeds").getRepository("tags").delete({});
  }
}
