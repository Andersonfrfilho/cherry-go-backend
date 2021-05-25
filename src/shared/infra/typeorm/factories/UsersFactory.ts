import faker from "faker";

import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { ParametersFactoryDTO } from "@shared/infra/typeorm/dtos/Factory.dto";

interface ICreateUserParametersFactory
  extends Partial<User>,
    ParametersFactoryDTO {}

class UsersFactory {
  public generate({
    name,
    last_name,
    email,
    rg,
    cpf,
    birth_date,
    password_hash = process.env.PASSWORD_USER_SEED_HASH,
    active,
    quantity = 1,
  }: ICreateUserParametersFactory): Omit<User, "id">[] {
    const arrayUsers = Array.from(
      { length: quantity },
      (): Omit<User, "id"> => ({
        name: name || faker.name.firstName(),
        last_name: last_name || faker.name.lastName(),
        email: email || faker.internet.email(),
        birth_date: birth_date || faker.date.past(),
        cpf:
          rg ||
          faker.datatype
            .number({ min: 10000000000, max: 99999999999 })
            .toString(),
        rg:
          cpf ||
          faker.datatype.number({ min: 10000000, max: 999999999 }).toString(),
        password_hash: password_hash || faker.internet.password(),
        active: active || faker.datatype.boolean(),
      })
    );
    return arrayUsers;
  }
}
export { UsersFactory };
