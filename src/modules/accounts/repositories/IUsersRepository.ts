import {
  ICreateUserClientDTO,
  ICreateUserAddressClientDTO,
} from "@modules/accounts/dtos";
import { IFindUserEmailCpfRgDTO } from "@modules/accounts/dtos/IFindUserEmailCpfRgDTO";
import { User } from "@modules/accounts/infra/typeorm/entities/User";

interface IUsersRepository {
  create(data: ICreateUserClientDTO): Promise<User>;
  createUserAddress(data: ICreateUserAddressClientDTO): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findByRg(rg: string): Promise<User>;
  findByCpf(cpf: string): Promise<User>;
  findById(id: string): Promise<User>;
  findUserByEmailCpfRg({
    email,
    rg,
    cpf,
  }: IFindUserEmailCpfRgDTO): Promise<User>;
}

export { IUsersRepository };
