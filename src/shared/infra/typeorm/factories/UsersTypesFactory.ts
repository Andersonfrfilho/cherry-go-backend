import { UserTypes } from "@modules/accounts/enums/UserTypes";
import { TypeUser } from "@modules/accounts/infra/typeorm/entities/TypeUser";

class UsersTypesFactory {
  public generate(): Omit<TypeUser, "id">[] {
    return Array.from(
      { length: Object.keys(UserTypes).length },
      (_, index): Omit<TypeUser, "id"> => ({
        name: Object.values(UserTypes)[index],
        active: true,
      })
    );
  }
}
export { UsersTypesFactory };
