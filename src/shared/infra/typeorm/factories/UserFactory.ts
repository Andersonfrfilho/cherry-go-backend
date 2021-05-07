import faker from "faker";

import { User } from "@modules/accounts/infra/typeorm/entities/User";

interface IUserInterfaceFactory {
  quantity: number;
}

class UserFactory {
  public generate({ quantity = 1 }: IUserInterfaceFactory): Omit<User, "id">[] {
    const arrayUsers = Array.from(
      { length: quantity },
      (): Omit<User, "id"> => ({
        name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        email: faker.internet.email(),
        birth_date: faker.date.past(),
        cpf: faker.random.alphaNumeric(11),
        rg: faker.random.alphaNumeric(10),
        password_hash: faker.internet.password(),
      })
    );
    return arrayUsers;
  }
}
export { UserFactory };
