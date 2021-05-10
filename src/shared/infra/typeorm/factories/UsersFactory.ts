import faker from "faker";

import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { UserFactory } from "@shared/infra/typeorm/dtos/Factory.dto";

class UsersFactory {
  public generate({ quantity = 1 }: UserFactory): Omit<User, "id">[] {
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
export { UsersFactory };
