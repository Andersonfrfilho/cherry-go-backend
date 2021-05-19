import {
  ICreateUserAddressClientDTO,
  ICreateUserClientDTO,
  IFindUserEmailCpfRgDTO,
} from "@modules/accounts/dtos";
import { Address } from "@modules/accounts/infra/typeorm/entities/Address";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";

class UsersRepositoryInMemory implements IUsersRepository {
  users: User[] = [];
  addresses: Address[] = [];
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
      name,
      last_name,
      email,
      cpf,
      rg,
      birth_date,
      password,
    });
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
    const user = this.users.find((user) => user.email === email);
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
      (user) => user.cpf === cpf && user.rg === rg && user.email === email
    );
  }
}

export { UsersRepositoryInMemory };
