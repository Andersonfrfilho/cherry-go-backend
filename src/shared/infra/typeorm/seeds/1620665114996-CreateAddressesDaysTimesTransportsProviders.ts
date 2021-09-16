import faker from "faker";
import { getConnection, MigrationInterface } from "typeorm";

import { DAYS_WEEK_ENUM } from "@modules/accounts/enums/DaysProviders.enum";
import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";
import { TRANSPORT_TYPES_ENUM } from "@modules/transports/enums/TransportsTypes.enum";
import { TransportType } from "@modules/transports/infra/typeorm/entities/TransportType";
import {
  AddressesFactory,
  ImagesFactory,
  TagsFactory,
} from "@shared/infra/typeorm/factories";

export class CreateAddressesDaysTimesTransportsProviders1620665114995
  implements MigrationInterface {
  public async up(): Promise<void> {
    const providers = await getConnection("seeds")
      .getRepository(Provider)
      .createQueryBuilder("users")
      .leftJoinAndSelect("users.types", "types")
      .leftJoinAndSelect("types.user_type", "user_type")
      .where("user_type.name like :name", { name: "provider" })
      .getMany();
    const address_factory = new AddressesFactory();

    const providers_addresses = address_factory.generate({
      quantity: providers.length,
    });
    const addresses = await getConnection("seeds")
      .getRepository("addresses")
      .save(providers_addresses);
    const related_addresses = providers.map((provider, index) => ({
      provider_id: provider.id,
      address_id: addresses[index].id,
      active: true,
      amount: faker.datatype.number({ min: 10, max: 999 }),
    }));
    await getConnection("seeds")
      .getRepository("providers_addresses")
      .save(related_addresses);

    let related = 0;
    const related_days_providers = [];
    while (related < providers.length && !!providers[related]) {
      Object.values(DAYS_WEEK_ENUM).forEach((day) => {
        related_days_providers.push({
          provider_id: providers[related].id,
          day,
        });
      });

      related += 1;
    }

    await getConnection("seeds")
      .getRepository("providers_availabilities_days")
      .save(related_days_providers);

    const transports_types = (await getConnection("seeds")
      .getRepository("transports_types")
      .find()) as TransportType[];
    related = 0;
    const related_transports_types_providers = [];
    while (related < providers.length && !!providers[related]) {
      transports_types.forEach((transport_type, index) => {
        related_transports_types_providers.push({
          provider_id: providers[related].id,
          transport_type_id: transport_type.id,
          active: true,
          amount:
            transport_type.name === TRANSPORT_TYPES_ENUM.PROVIDER
              ? faker.datatype.number({ min: 10, max: 999 })
              : undefined,
        });
      });

      related += 1;
    }

    await getConnection("seeds")
      .getRepository("providers_transports_types")
      .save(related_transports_types_providers);

    let data_initial = faker.datatype.number({ min: 11, max: 13 });
    let data_final = faker.datatype.number({ min: 14, max: 15 });

    const providers_times = providers.map((provider) => ({
      provider_id: provider.id,
      start_time: faker.phone.phoneNumber(`${data_initial}:##`),
      end_time: faker.phone.phoneNumber(`${data_final}:##`),
    }));

    await getConnection("seeds")
      .getRepository("providers_availabilities_times")
      .save(providers_times);

    data_initial = faker.datatype.number({ min: 17, max: 19 });
    data_final = faker.datatype.number({ min: 20, max: 22 });

    const providers_times_two = providers.map((provider) => ({
      provider_id: provider.id,
      start_time: faker.phone.phoneNumber(`${data_initial}:##`),
      end_time: faker.phone.phoneNumber(`${data_final}:##`),
    }));

    await getConnection("seeds")
      .getRepository("providers_availabilities_times")
      .save(providers_times_two);

    const tags_factory = new TagsFactory();
    const images_factory = new ImagesFactory();

    const tags_factory_list = tags_factory.generate({
      quantity: providers.length,
    });

    const images_factory_list = images_factory.generate({
      quantity: tags_factory_list.length,
    });

    const images = await getConnection("seeds")
      .getRepository("images")
      .save(images_factory_list);

    const images_tags = tags_factory_list.map((tag, index) => ({
      ...tag,
      image_id: images[index].id,
    }));

    const tags = await getConnection("seeds")
      .getRepository("tags")
      .save(images_tags);

    const related_provider_tags = providers.map((provider, index) => ({
      tag_id: tags[index].id,
      provider_id: provider.id,
    }));

    await getConnection("seeds")
      .getRepository("providers_tags")
      .save(related_provider_tags);
  }

  public async down(): Promise<void> {
    await getConnection("seeds").getRepository("providers_tags").delete({});
    await getConnection("seeds").getRepository("images").delete({});
    await getConnection("seeds").getRepository("tags").delete({});
    await getConnection("seeds")
      .getRepository("providers_addresses")
      .delete({});
    await getConnection("seeds")
      .getRepository("providers_availabilities_days")
      .delete({});
    await getConnection("seeds")
      .getRepository("providers_availabilities_times")
      .delete({});
  }
}
