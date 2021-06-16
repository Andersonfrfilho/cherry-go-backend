import faker from "faker";

import { PaymentType } from "@modules/appointments/infra/typeorm/entities/PaymentType";
import { PaymentTypes } from "@modules/transactions/enums/PaymentTypes.enum";
import { PaymentsTypesFactoryDTO } from "@shared/infra/typeorm/factories/dtos";

class PaymentsTypesFactory {
  public generate({
    active,
    description,
  }: Partial<PaymentsTypesFactoryDTO>): Omit<PaymentType, "id">[] {
    return Array.from(
      { length: Object.keys(PaymentTypes).length },
      (_, index): Omit<PaymentType, "id"> => ({
        name: Object.values(PaymentTypes)[index],
        active: active || true,
        description: description || faker.lorem.words(),
      })
    );
  }
}
export { PaymentsTypesFactory };
