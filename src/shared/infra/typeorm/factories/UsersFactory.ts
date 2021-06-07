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
    id,
  }: ICreateUserParametersFactory): Partial<User>[] {
    const arrayUsers = Array.from(
      { length: quantity },
      (): Partial<User> => ({
        id: id ? faker.datatype.uuid() : undefined,
        name: name || faker.name.firstName(),
        last_name: last_name || faker.name.lastName(),
        email: email || faker.internet.email(),
        birth_date: birth_date || faker.date.past(),
        cpf: rg || faker.phone.phoneNumber("###########"),
        rg:
          cpf ||
          faker.phone.phoneNumber(
            faker.datatype.boolean() ? "########" : "#########"
          ),
        password_hash: password_hash || faker.internet.password(),
        active,
      })
    );
    return arrayUsers;
  }
}
export { UsersFactory };
