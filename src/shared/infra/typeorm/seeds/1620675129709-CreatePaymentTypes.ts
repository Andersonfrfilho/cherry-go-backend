import { getConnection, MigrationInterface } from "typeorm";

import { Provider } from "@modules/accounts/infra/typeorm/entities/Providers";
import { PaymentsTypesFactory } from "@shared/infra/typeorm/factories";
import randomNumbers from "@utils/randomNumbers";

export class CreatePaymentTypes1620675129709 implements MigrationInterface {
  public async up(): Promise<void> {
    const paymentTypesFactory = new PaymentsTypesFactory();

    const paymentTypes = paymentTypesFactory.generate();

    await getConnection("seed")
      .getRepository("payments_types")
      .save(paymentTypes);

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

    const relationshipProvidersPaymentsTypes = providers.map((provider) => ({
      ...provider,
      payments_types: Array.from({
        length: randomNumbers({ min: 1, max: payments_types_list.length }),
      }).map((_, index) => payments_types_list[index]),
    }));

    await getConnection("seed")
      .getRepository(Provider)
      .save(relationshipProvidersPaymentsTypes);
  }

  public async down(): Promise<void> {
    await getConnection("seed")
      .getRepository("providers_payments_types")
      .delete({});
    await getConnection("seed").getRepository("payments_types").delete({});
  }
}
