import faker from "faker";
import { getConnection, MigrationInterface } from "typeorm";

import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";
import { Service } from "@modules/accounts/infra/typeorm/entities/Services";
import { ServicesFactory } from "@shared/infra/typeorm/factories";

export class CreateServices1620945118173 implements MigrationInterface {
  public async up(): Promise<void> {
    // const providers = await getConnection("seeds")
    //   .getRepository(Provider)
    //   .createQueryBuilder("users")
    //   .leftJoinAndSelect(
    //     "users.types",
    //     "types_users",
    //     "types_users.name = :category_name",
    //     { category_name: "provider" }
    //   )
    //   .getMany();
    // const services_factory = new ServicesFactory();
    // const services_factoryList = services_factory.generate({
    //   quantity: faker.datatype.number({
    //     min: providers.length,
    //     max: providers.length * 2,
    //   }),
    // });
    // await getConnection("seeds")
    //   .getRepository("services")
    //   .save(services_factoryList);
    // const services = (await getConnection("seeds")
    //   .getRepository("services")
    //   .find()) as Service[];
    // const providers_services = providers.map((provider) => ({
    //   ...provider,
    //   services: Array.from({
    //     length: faker.datatype.number({
    //       min: 1,
    //       max: services.length,
    //     }),
    //   }).map((_, index) => services[index]),
    // }));
    // await getConnection("seeds")
    //   .getRepository(Provider)
    //   .save(providers_services);
  }

  public async down(): Promise<void> {
    // await getConnection("seeds").getRepository("providers_services").delete({});
    // await getConnection("seeds").getRepository("services").delete({});
  }
}
