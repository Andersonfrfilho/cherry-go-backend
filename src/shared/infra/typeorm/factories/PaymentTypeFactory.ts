import faker from "faker";

import { PaymentTypes } from "@modules/transactions/enums/PaymentTypes.enum";
import { PaymentType } from "@modules/transactions/infra/typeorm/entities/PaymentType";

class PaymentsTypesFactory {
  public generate(): Omit<PaymentType, "id">[] {
    return Array.from(
      { length: Object.keys(PaymentTypes).length },
      (element, index): Omit<PaymentType, "id"> => ({
        name: Object.values(PaymentTypes)[index],
        active: true,
        description: faker.lorem.words(),
      })
    );
  }
}
export { PaymentsTypesFactory };
