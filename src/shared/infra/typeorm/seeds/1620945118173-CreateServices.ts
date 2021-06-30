import faker from "faker";
import { getConnection, MigrationInterface } from "typeorm";

import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";
import { ServicesFactory } from "@shared/infra/typeorm/factories";

export class CreateServices1620945118173 implements MigrationInterface {
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

    const services_factory = new ServicesFactory();

    const services_factoryList = services_factory.generate({
      quantity: faker.datatype.number({
        min: providers.length,
        max: providers.length * providers.length,
      }),
    });

    let related = 0;

    while (related < services_factoryList.length) {
      let related_providers = 0;
      while (
        related_providers < providers.length &&
        related < services_factoryList.length
      ) {
        services_factoryList[related].provider_id =
          providers[related_providers].id;
        related_providers += 1;
        related += 1;
      }
    }

    await getConnection("seeds")
      .getRepository("services")
      .save(services_factoryList);
  }

  public async down(): Promise<void> {
    await getConnection("seeds").getRepository("services").delete({});
  }
}
