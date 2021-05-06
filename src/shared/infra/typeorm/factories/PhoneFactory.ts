import faker from "faker";

import { Phone } from "@modules/accounts/infra/typeorm/entities/Phone";

interface IUserInterfaceFactory {
  quantity: number;
}

class UserFactory {
  public generate({
    quantity = 1,
  }: IUserInterfaceFactory): Omit<Phone, "id">[] {
    const arrayUsers = Array.from(
      { length: quantity },
      (): Omit<User, "id"> => ({
        name: faker.name.findName(),
        password: faker.internet.password(),
        email: faker.internet.email(),
        driver_license: faker.name.jobType(),
        isAdmin: faker.datatype.boolean(),
      })
    );
    return arrayUsers;
  }
}
export { UserFactory };
