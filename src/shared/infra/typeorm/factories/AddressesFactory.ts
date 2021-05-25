import faker from "faker";

import { Address } from "@modules/accounts/infra/typeorm/entities/Address";
import { ParametersFactoryDTO } from "@shared/infra/typeorm/dtos/Factory.dto";

interface ICreateUserParametersFactory
  extends Partial<Address>,
    ParametersFactoryDTO {}

class AddressesFactory {
  public generate({
    quantity = 1,
    city,
    country,
    number,
    state,
    street,
    zipcode,
    district,
  }: ICreateUserParametersFactory): Omit<Address, "id" | "id_user">[] {
    return Array.from(
      { length: quantity },
      (): Omit<Address, "id" | "id_user"> => ({
        city: city || faker.address.city(),
        country: country || faker.address.country(),
        district: district || faker.address.secondaryAddress(),
        number: number || faker.random.alphaNumeric(4),
        state: state || faker.address.state(),
        street: street || faker.address.streetName(),
        zipcode: zipcode || faker.address.zipCode(),
      })
    );
  }
}
export { AddressesFactory };
