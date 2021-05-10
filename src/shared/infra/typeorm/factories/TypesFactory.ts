import faker from "faker";

import { TypeUser } from "@modules/accounts/infra/typeorm/entities/TypeUser";

class TypesFactory {
  public generate(): Omit<TypeUser, "id">[] {
    const types = ["ADMIN", "CLIENT", "PROVIDER"];
    return Array.from(
      { length: types.length },
      (element, index): Omit<TypeUser, "id"> => ({
        name: types[index],
        active: true,
      })
    );
  }
}
export { TypesFactory };
