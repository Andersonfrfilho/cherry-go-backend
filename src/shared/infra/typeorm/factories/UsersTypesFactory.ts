import faker from "faker";

import { UserTypesEnum } from "@modules/accounts/enums/UserTypes.enum";
import { TypeUser } from "@modules/accounts/infra/typeorm/entities/TypeUser";
import { UsersTypesFactoryDTO } from "@shared/infra/typeorm/factories/dtos";

class UsersTypesFactory {
  public generate({
    id,
    description,
    active,
  }: Partial<UsersTypesFactoryDTO>): Partial<TypeUser>[] {
    return Array.from(
      { length: Object.keys(UserTypesEnum).length },
      (_, index): Partial<TypeUser> => ({
        id: id ? faker.datatype.uuid() : undefined,
        name: Object.values(UserTypesEnum)[index],
        active: active || true,
        description: description || faker.random.words(),
      })
    );
  }
}
export { UsersTypesFactory };
