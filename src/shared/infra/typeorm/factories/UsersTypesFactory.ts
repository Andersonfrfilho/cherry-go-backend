import faker from "faker";

import { UserTypes } from "@modules/accounts/enums/UserTypes.enum";
import { TypeUser } from "@modules/accounts/infra/typeorm/entities/TypeUser";

class UsersTypesFactory {
  public generate(): Omit<TypeUser, "id">[] {
    return Array.from(
      { length: Object.keys(UserTypes).length },
      (_, index): Omit<TypeUser, "id"> => ({
        name: Object.values(UserTypes)[index],
        active: true,
        description: faker.random.words(),
      })
    );
  }
}
export { UsersTypesFactory };
