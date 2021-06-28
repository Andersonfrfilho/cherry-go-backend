import { getRepository, Repository } from "typeorm";

import { CreateTypesUsersRepositoryDTO } from "@modules/accounts/dtos";
import { TypeUser } from "@modules/accounts/infra/typeorm/entities/TypeUser";
import { TypesUsersRepositoryInterface } from "@modules/accounts/repositories/TypesUsersRepository.interface";

class TypesUsersRepository implements TypesUsersRepositoryInterface {
  private repository: Repository<TypeUser>;

  constructor() {
    this.repository = getRepository(TypeUser);
  }
  async create({
    active,
    description,
    name,
  }: CreateTypesUsersRepositoryDTO): Promise<TypeUser> {
    return this.repository.save({ active, description, name });
  }
  async findByName(name: string): Promise<TypeUser> {
    return this.repository.findOne({ where: { name } });
  }
}
export { TypesUsersRepository };
