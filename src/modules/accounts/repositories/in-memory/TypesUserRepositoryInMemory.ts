import { ICreateTypesUsersDTO } from "@modules/accounts/dtos";
import { TypeUser } from "@modules/accounts/infra/typeorm/entities/TypeUser";
import { AppError } from "@shared/errors/AppError";

import { ITypesUsersRepository } from "../IUsersTypesRepository";

class TypesUserRepositoryInMemory implements ITypesUsersRepository {
  types_users: TypeUser[] = [];

  async create({
    active,
    name,
    description,
  }: ICreateTypesUsersDTO): Promise<TypeUser> {
    const type_user = new TypeUser();

    if (this.types_users.some((user_type) => user_type.name === name)) {
      throw new AppError({ message: "User Type client already exist!" });
    }

    Object.assign(type_user, {
      name: name.toLowerCase(),
      active,
      description,
    }) as TypeUser;

    this.types_users.push(type_user);

    return type_user;
  }
  async findByName(name: string): Promise<TypeUser> {
    return this.types_users.find((user) => user.name === name.toLowerCase());
  }
}

export { TypesUserRepositoryInMemory };
