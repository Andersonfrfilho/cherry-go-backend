import { getConnection, MigrationInterface } from "typeorm";

import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";
import { PaymentType } from "@modules/appointments/infra/typeorm/entities/PaymentType";

export class CreatePaymentTypes1620675129709 implements MigrationInterface {
  public async up(): Promise<void> {
    const providers = await getConnection("seeds")
      .getRepository(Provider)
      .createQueryBuilder("users")
      .leftJoinAndSelect("users.types", "types")
      .leftJoinAndSelect("types.user_type", "user_type")
      .where("user_type.name like :name", { name: "provider" })
      .getMany();

    const payments_types_list = (await getConnection("seeds")
      .getRepository("payments_types")
      .find()) as PaymentType[];

    let related = 0;

    const related_array = [];

    while (related < providers.length) {
      let related_types = 0;
      while (related_types < payments_types_list.length) {
        if (
          related <= payments_types_list.length * payments_types_list.length &&
          related < providers.length &&
          related_types < payments_types_list.length
        ) {
          related_array.push({
            provider_id: providers[related].id,
            payment_type_id: payments_types_list[related_types].id,
            active: true,
          });
          related += 1;
        }
        if (
          related < providers.length &&
          related > payments_types_list.length * payments_types_list.length &&
          related <=
            payments_types_list.length * payments_types_list.length +
              payments_types_list.length &&
          related_types < payments_types_list.length
        ) {
          const data = payments_types_list
            .filter((_, index) => index !== payments_types_list.length - 1)
            .map((payment_type_list) => ({
              provider_id: providers[related].id,
              payment_type_id: payment_type_list.id,
              active: true,
            }));
          related_array.push(...data);
          related += 1;
        }
        if (
          related < providers.length &&
          related >
            payments_types_list.length * payments_types_list.length +
              payments_types_list.length &&
          related_types < payments_types_list.length
        ) {
          const data = payments_types_list.map((payment_type_list) => ({
            provider_id: providers[related].id,
            payment_type_id: payment_type_list.id,
            active: true,
          }));
          related_array.push(...data);
          related += 1;
        }
        related_types += 1;
      }
    }

    await getConnection("seeds")
      .getRepository("providers_payments_types")
      .save(related_array);
  }

  public async down(): Promise<void> {
    await getConnection("seeds")
      .getRepository("providers_payments_types")
      .delete({});
    await getConnection("seeds").getRepository("payments_types").delete({});
  }
}
