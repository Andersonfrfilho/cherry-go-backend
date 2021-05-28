import { datatype } from "faker";

import {
  ICreateUserAddressClientDTO,
  ICreateUserClientDTO,
  IFindUserEmailCpfRgDTO,
  IUpdatedUserClientDTO,
} from "@modules/accounts/dtos";
import { UserTypes } from "@modules/accounts/enums/UserTypes.enum";
import { Address } from "@modules/accounts/infra/typeorm/entities/Address";
import { TypeUser } from "@modules/accounts/infra/typeorm/entities/TypeUser";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";

class UsersRepositoryInMemory implements IUsersRepository {
  users: User[] = [];
  addresses: Address[] = [];
  types_users: TypeUser[] = [];

  async createUserClientType({
    birth_date,
    cpf,
    name,
    password,
    email,
    last_name,
    rg,
  }: ICreateUserClientDTO): Promise<User> {
    const user = new User();
    const user_type = new TypeUser();
    if (this.users.some((user) => user.email === email)) {
      throw new AppError({ message: "User client already exist" });
    }

    Object.assign(user_type, {
      id: datatype.uuid(),
      name: UserTypes.CLIENT,
      description: name.toLocaleLowerCase(),
      active: true,
    }) as TypeUser;

    const type = this.types_users.find(
      (user_type) => user_type.name === UserTypes.CLIENT
    );

    if (!type) {
      throw new AppError({ message: "Type User not exist!" });
    }

    Object.assign(user, {
      id: datatype.uuid(),
      name: name.toLowerCase(),
      last_name: last_name.toLowerCase(),
      email: email.toLowerCase(),
      cpf,
      rg,
      birth_date,
      password_hash: password,
      types: [type],
    }) as User;

    this.users.push(user);

    return user;
  }

  async updatePasswordUser({
    id,
    password_hash,
  }: IUpdatedUserClientDTO): Promise<User> {
    const index = this.users.findIndex((user) => user.id === id);
    this.users[index].password_hash = password_hash;
    return this.users[index];
  }

  async create({
    name,
    last_name,
    email,
    cpf,
    rg,
    birth_date,
    password,
  }: ICreateUserClientDTO): Promise<User> {
    const user = new User();

    if (this.users.some((user) => user.email === email)) {
      throw new AppError({ message: "User client already exist" });
    }

    Object.assign(user, {
      id: datatype.uuid(),
      name: name.toLowerCase(),
      last_name: last_name.toLowerCase(),
      email: email.toLowerCase(),
      cpf,
      rg,
      birth_date,
      password_hash: password,
    }) as User;

    this.users.push(user);

    return user;
  }

  async createUserAddress({
    user,
    city,
    country,
    district,
    state,
    street,
    zipcode,
    number,
  }: ICreateUserAddressClientDTO): Promise<User> {
    const address_found = this.addresses.find(
      (address) =>
        street === address.street &&
        number === address.number &&
        zipcode === address.zipcode &&
        city === address.city
    );
    if (address_found) {
      const user_addresses = user;
      user_addresses.addresses = [address_found];
      this.users.push(user_addresses);
    }
    const user_addresses = user;
    const address = new Address();

    Object.assign(address, {
      id: datatype.uuid(),
      city,
      country,
      district,
      state,
      street,
      zipcode,
      number,
    });

    user_addresses.addresses = [address];

    this.addresses.push({
      city,
      country,
      district,
      state,
      street,
      zipcode,
      number,
    });

    this.users.push(user_addresses);

    return user_addresses;
  }

  async findByEmail(email: string): Promise<User> {
    const user = this.users.find((user) => user.email === email.toLowerCase());
    return user;
  }

  async findById(id: string): Promise<User> {
    return this.users.find((user) => user.id === id);
  }

  async findByRg(rg: string): Promise<User> {
    return this.users.find((user) => user.rg === rg);
  }

  async findByCpf(cpf: string): Promise<User> {
    return this.users.find((user) => user.cpf === cpf);
  }

  async findUserByEmailCpfRg({
    email,
    rg,
    cpf,
  }: IFindUserEmailCpfRgDTO): Promise<User> {
    return this.users.find(
      (user) =>
        user.cpf === cpf && user.rg === rg && user.email === email.toLowerCase()
    );
  }
}

export { UsersRepositoryInMemory };
