import { getRepository, Repository } from "typeorm";

import { ICreateTypesUsersDTO } from "@modules/accounts/dtos";
import { TypeUser } from "@modules/accounts/infra/typeorm/entities/TypeUser";
import { ITypesUsersRepository } from "@modules/accounts/repositories/IUsersTypesRepository";

class TypesUsersRepository implements ITypesUsersRepository {
  private repository: Repository<TypeUser>;

  constructor() {
    this.repository = getRepository(TypeUser);
  }
  async create({
    active,
    description,
    name,
  }: ICreateTypesUsersDTO): Promise<TypeUser> {
    const user_type = this.repository.create({ active, description, name });
    await this.repository.save(user_type);
    return user_type;
  }
  async findByName(name: string): Promise<TypeUser> {
    return this.repository.findOne({ where: { name } });
  }
}
export { TypesUsersRepository };
