import faker from "faker";
import { getConnection, MigrationInterface } from "typeorm";

import { PaymentType } from "@modules/appointments/infra/typeorm/entities/PaymentType";
import { TransportType } from "@modules/transports/infra/typeorm/entities/TransportType";
import { TransportsTypesFactory } from "@shared/infra/typeorm/factories/TransportsTypesFactory";

export class CreateTransportsTypes1621099130674 implements MigrationInterface {
  public async up(): Promise<void> {
    const transport_types_factory = new TransportsTypesFactory();

    const transport_type_factory_list = transport_types_factory.generate();

    await getConnection("seeds")
      .getRepository("transports_types")
      .save(transport_type_factory_list);

    const transports_types_list = (await getConnection("seeds")
      .getRepository("transports_types")
      .find()) as TransportType[];

    const payment_type_list = (await getConnection("seeds")
      .getRepository(PaymentType)
      .find()) as PaymentType[];

    const transport_type = transports_types_list
      .map((transport_type) =>
        Array.from({
          length: faker.datatype.number({
            min: 1,
            max: payment_type_list.length,
          }),
        }).map((_, index) => ({
          payment_type_id: payment_type_list[index].id,
          transport_type_id: transport_type.id,
          active: faker.datatype.boolean(),
        }))
      )
      .reduce((accumulator, currentValue) => [...accumulator, ...currentValue]);

    await getConnection("seeds")
      .getRepository("transports_types_payments_types")
      .save(transport_type);
  }

  public async down(): Promise<void> {
    await getConnection("seeds").getRepository("transports_types").delete({});
  }
}
