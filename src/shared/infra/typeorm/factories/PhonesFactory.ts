import faker from "faker";

import { Phone } from "@modules/accounts/infra/typeorm/entities/Phone";
import { ParametersFactoryDTO } from "@shared/infra/typeorm/dtos/Factory.dto";

class PhonesFactory {
  public generate({ quantity = 1 }: ParametersFactoryDTO): Omit<Phone, "id">[] {
    return Array.from(
      { length: quantity },
      (): Omit<Phone, "id"> => ({
        country_code: faker.phone.phoneNumber("+##"),
        ddd: faker.phone.phoneNumber("##"),
        number: faker.phone.phoneNumber("9########"),
      })
    );
  }
}
export { PhonesFactory };
