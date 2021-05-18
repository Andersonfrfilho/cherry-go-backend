import faker from "faker";
import { getConnection, MigrationInterface } from "typeorm";

import { Provider } from "@modules/accounts/infra/typeorm/entities/Providers";
import { PaymentsTypesFactory } from "@shared/infra/typeorm/factories";

export class CreatePaymentTypes1620675129709 implements MigrationInterface {
  public async up(): Promise<void> {
    const payment_types_factory = new PaymentsTypesFactory();

    const payment_types = payment_types_factory.generate();

    await getConnection("seed")
      .getRepository("payments_types")
      .save(payment_types);

    const payments_types_list = await getConnection("seed")
      .getRepository("payments_types")
      .find();

    const providers = await getConnection("seed")
      .getRepository(Provider)
      .createQueryBuilder("users")
      .leftJoinAndSelect(
        "users.types",
        "types_users",
        "types_users.name = :category_name",
        { category_name: "provider" }
      )
      .getMany();

    const relationship_providers_payments_types = providers.map((provider) => ({
      ...provider,
      payments_types: Array.from({
        length: faker.datatype.number({
          min: 1,
          max: payments_types_list.length,
        }),
      }).map((_, index) => payments_types_list[index]),
    }));

    await getConnection("seed")
      .getRepository(Provider)
      .save(relationship_providers_payments_types);
  }

  public async down(): Promise<void> {
    await getConnection("seed")
      .getRepository("providers_payments_types")
      .delete({});
    await getConnection("seed").getRepository("payments_types").delete({});
  }
}
