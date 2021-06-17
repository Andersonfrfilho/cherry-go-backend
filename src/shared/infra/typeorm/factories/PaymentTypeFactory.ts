import faker from "faker";

import { PaymentType } from "@modules/appointments/infra/typeorm/entities/PaymentType";
import { PaymentTypesEnum } from "@modules/transactions/enums/PaymentTypes.enum";
import { PaymentsTypesFactoryDTO } from "@shared/infra/typeorm/factories/dtos";

class PaymentsTypesFactory {
  public generate({
    active,
    description,
  }: Partial<PaymentsTypesFactoryDTO>): Omit<PaymentType, "id">[] {
    return Array.from(
      { length: Object.keys(PaymentTypesEnum).length },
      (_, index): Omit<PaymentType, "id"> => ({
        name: Object.values(PaymentTypesEnum)[index],
        active: active || true,
        description: description
          ? description || faker.lorem.words()
          : undefined,
      })
    );
  }
}
export { PaymentsTypesFactory };
