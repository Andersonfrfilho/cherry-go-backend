import faker from "faker";

import { PaymentType } from "@modules/appointments/infra/typeorm/entities/PaymentType";
import { PAYMENT_TYPES_ENUM } from "@modules/transactions/enums/PaymentTypes.enum";
import { ParametersFactoryDTO } from "@shared/infra/typeorm/dtos/Factory.dto";

interface CreatePaymentTypeParametersFactoryDTO
  extends Partial<PaymentType>,
    ParametersFactoryDTO {}
export class PaymentsTypesFactory {
  public generate({
    id,
    active,
    description,
  }: CreatePaymentTypeParametersFactoryDTO): Partial<PaymentType>[] {
    return Array.from(
      { length: Object.keys(PAYMENT_TYPES_ENUM).length },
      (_, index): Partial<PaymentType> => ({
        id: id ? faker.datatype.uuid() : undefined,
        name: Object.values(PAYMENT_TYPES_ENUM)[index],
        active: typeof active === "boolean" ? active : faker.datatype.boolean(),
        description:
          description === "faker" ? faker.lorem.words() : description,
      })
    );
  }
}
