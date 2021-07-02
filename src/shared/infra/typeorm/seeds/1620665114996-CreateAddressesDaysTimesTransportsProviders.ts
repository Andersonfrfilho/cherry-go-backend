import faker from "faker";
import { getConnection, MigrationInterface } from "typeorm";

import { DAYS_WEEK_ENUMS } from "@modules/accounts/enums/DaysProviders.enum";
import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";
import { AddressesFactory } from "@shared/infra/typeorm/factories";

export class CreateAddressesDaysTimesProviders1620665114995
  implements MigrationInterface {
  public async up(): Promise<void> {
    const providers = await getConnection("seeds")
      .getRepository(Provider)
      .createQueryBuilder("users")
      .leftJoinAndSelect(
        "users.types",
        "types_users",
        "types_users.name = :category_name",
        { category_name: "provider" }
      )
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
      Object.values(DAYS_WEEK_ENUMS).forEach((day) => {
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
  }

  public async down(): Promise<void> {
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
