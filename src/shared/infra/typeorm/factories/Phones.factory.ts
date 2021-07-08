import faker from "faker";

import { Phone } from "@modules/accounts/infra/typeorm/entities/Phone";
import { ParametersFactoryDTO } from "@shared/infra/typeorm/dtos/Factory.dto";

interface CreatePhoneParametersFactoryDTO
  extends Partial<Phone>,
    ParametersFactoryDTO {}
export class PhonesFactory {
  public generate({
    quantity = 1,
    id,
    ddd,
    number,
    country_code,
  }: CreatePhoneParametersFactoryDTO): Partial<Phone>[] {
    return Array.from(
      { length: quantity },
      (): Partial<Phone> => ({
        id: id ? faker.datatype.uuid() : undefined,
        country_code: country_code || faker.phone.phoneNumber("+##"),
        ddd: ddd || faker.phone.phoneNumber("##"),
        number: number || faker.phone.phoneNumber("9########"),
      })
    );
  }
}
