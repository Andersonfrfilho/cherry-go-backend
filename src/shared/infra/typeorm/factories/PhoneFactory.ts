import faker from "faker";

import { Phone } from "@modules/accounts/infra/typeorm/entities/Phone";

interface IUserInterfaceFactory {
  quantity: number;
}

class PhoneFactory {
  public generate({
    quantity = 1,
  }: IUserInterfaceFactory): Omit<Phone, "id">[] {
    return Array.from(
      { length: quantity },
      (): Omit<Phone, "id"> => ({
        country_code: `+${faker.datatype
          .number({ min: 10, max: 99 })
          .toString()}`,
        ddd: `0${faker.datatype.number({ min: 10, max: 99 }).toString()}`,
        number: `${faker.datatype
          .number({ min: 1000, max: 9999 })
          .toString()}-${faker.datatype
          .number({ min: 1000, max: 9999 })
          .toString()}`,
      })
    );
  }
}
export { PhoneFactory };
