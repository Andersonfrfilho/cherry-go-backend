import { getConnection, MigrationInterface } from "typeorm";

import { TransportsTypesFactory } from "@shared/infra/typeorm/factories/TransportsTypesFactory";

export class CreateTransportsTypes1621099130674 implements MigrationInterface {
  public async up(): Promise<void> {
    const transport_types_factory = new TransportsTypesFactory();

    const transport_type_factory_list = transport_types_factory.generate({});

    await getConnection("seeds")
      .getRepository("transports_types")
      .save(transport_type_factory_list);
  }

  public async down(): Promise<void> {
    await getConnection("seeds").getRepository("transports_types").delete({});
  }
}
