import {
  ICreateUserClientDTO,
  ICreateUserAddressClientDTO,
  IUpdatedUserClientDTO,
  ICreateUserPhonesClientRequestDTO,
  IUpdateActiveUserDTO,
  UpdateActivePhoneUserDTO,
} from "@modules/accounts/dtos";
import { IFindUserEmailCpfRgDTO } from "@modules/accounts/dtos/IFindUserEmailCpfRgDTO";
import { User } from "@modules/accounts/infra/typeorm/entities/User";

interface IUsersRepository {
  create(data: ICreateUserClientDTO): Promise<User>;
  createUserAddress(data: ICreateUserAddressClientDTO): Promise<User>;
  createUserPhones(data: ICreateUserPhonesClientRequestDTO): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findByRg(rg: string): Promise<User>;
  findByCpf(cpf: string): Promise<User>;
  findById(id: string): Promise<User>;
  findUserByEmailCpfRg({
    email,
    rg,
    cpf,
  }: IFindUserEmailCpfRgDTO): Promise<User>;
  updatePasswordUser({
    id,
    password_hash,
  }: IUpdatedUserClientDTO): Promise<User>;
  createUserClientType(data: ICreateUserClientDTO): Promise<User>;
  updateActiveUser({ id, active }: IUpdateActiveUserDTO): Promise<void>;
  updateActivePhoneUser({
    user_id,
    active,
  }: UpdateActivePhoneUserDTO): Promise<void>;
}

export { IUsersRepository };
