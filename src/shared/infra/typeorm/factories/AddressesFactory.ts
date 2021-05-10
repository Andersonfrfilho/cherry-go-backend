import faker from "faker";

import { Address } from "@modules/accounts/infra/typeorm/entities/Address";
import { UserFactory } from "@shared/infra/typeorm/dtos/Factory.dto";

class AddressesFactory {
  public generate({
    quantity = 1,
  }: UserFactory): Omit<Address, "id" | "id_user">[] {
    return Array.from(
      { length: quantity },
      (): Omit<Address, "id" | "id_user"> => ({
        city: faker.address.city(),
        country: faker.address.country(),
        district: faker.address.secondaryAddress(),
        number: faker.random.alphaNumeric(4),
        state: faker.address.state(),
        street: faker.address.streetName(),
        zipcode: faker.address.zipCode(),
      })
    );
  }
}
export { AddressesFactory };
