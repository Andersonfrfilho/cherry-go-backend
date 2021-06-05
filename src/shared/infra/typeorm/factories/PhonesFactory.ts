import faker from "faker";

import { Phone } from "@modules/accounts/infra/typeorm/entities/Phone";
import { ParametersFactoryDTO } from "@shared/infra/typeorm/dtos/Factory.dto";

interface ICreatePhoneParametersFactory
  extends Partial<Phone>,
    ParametersFactoryDTO {}
class PhonesFactory {
  public generate({
    quantity = 1,
    id,
  }: ICreatePhoneParametersFactory): Partial<Phone>[] {
    return Array.from(
      { length: quantity },
      (): Partial<Phone> => ({
        id: id ? faker.datatype.uuid() : undefined,
        country_code: faker.phone.phoneNumber("+##"),
        ddd: faker.phone.phoneNumber("##"),
        number: faker.phone.phoneNumber("9########"),
      })
    );
  }
}
export { PhonesFactory };
