import { ICreateTypesUsersDTO } from "@modules/accounts/dtos";
import { TypeUser } from "@modules/accounts/infra/typeorm/entities/TypeUser";

interface TypesUsersRepositoryInterface {
  create(data: ICreateTypesUsersDTO): Promise<TypeUser>;
  findByName(name: string): Promise<TypeUser>;
}

export { TypesUsersRepositoryInterface };
