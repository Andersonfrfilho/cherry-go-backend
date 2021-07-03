import faker from "faker";

import { PaymentType } from "@modules/appointments/infra/typeorm/entities/PaymentType";
import { PAYMENT_TYPES_ENUM } from "@modules/transactions/enums/PaymentTypes.enum";
import { PaymentsTypesFactoryDTO } from "@shared/infra/typeorm/factories/dtos";

class PaymentsTypesFactory {
  public generate({
    active,
    description,
  }: Partial<PaymentsTypesFactoryDTO>): Omit<PaymentType, "id">[] {
    return Array.from(
      { length: Object.keys(PAYMENT_TYPES_ENUM).length },
      (_, index): Omit<PaymentType, "id"> => ({
        name: Object.values(PAYMENT_TYPES_ENUM)[index],
        active: active || true,
        description: description
          ? description || faker.lorem.words()
          : undefined,
      })
    );
  }
}
export { PaymentsTypesFactory };
