import faker from "faker";

import { UserTypes } from "@modules/accounts/enums/UserTypes.enum";
import { TypeUser } from "@modules/accounts/infra/typeorm/entities/TypeUser";

class UsersTypesFactory {
  public generate(id?: string): Partial<TypeUser>[] {
    return Array.from(
      { length: Object.keys(UserTypes).length },
      (_, index): Partial<TypeUser> => ({
        id: id ? faker.datatype.uuid() : undefined,
        name: Object.values(UserTypes)[index],
        active: true,
        description: faker.random.words(),
      })
    );
  }
}
export { UsersTypesFactory };
