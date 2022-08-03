import { faker } from "@faker-js/faker/locale/pt_BR";
import { USER_TYPES_ENUM } from "@modules/accounts/enums/UserTypes.enum";
import { TypeUser } from "@modules/accounts/infra/typeorm/entities/TypeUser";
import { UsersTypesFactoryDTO } from "@shared/infra/typeorm/factories/dtos";

export class UsersTypesFactory {
  public generate({
    id,
    description,
    active,
  }: Partial<UsersTypesFactoryDTO>): Partial<TypeUser>[] {
    return Array.from(
      { length: Object.keys(USER_TYPES_ENUM).length },
      (_, index): Partial<TypeUser> => ({
        id: id ? faker.datatype.uuid() : undefined,
        name: Object.values(USER_TYPES_ENUM)[index],
        description:
          description === "faker" ? faker.lorem.words() : description,
        active: typeof active === "boolean" ? active : faker.datatype.boolean(),
      })
    );
  }
}
