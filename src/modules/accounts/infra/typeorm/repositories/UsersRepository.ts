import { getRepository, Repository } from "typeorm";

import { ICreateUserAddressClientDTO } from "@modules/accounts/dtos";
import { ICreateUserClientDTO } from "@modules/accounts/dtos/ICreateUserClientDTO";
import { IFindUserEmailCpfRgDTO } from "@modules/accounts/dtos/IFindUserEmailCpfRgDTO";
import { Address } from "@modules/accounts/infra/typeorm/entities/Address";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { UserAddress } from "@modules/accounts/infra/typeorm/entities/UsersAddress";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";

class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;
  private repository_address: Repository<Address>;
  private repository_user_address: Repository<UserAddress>;

  constructor() {
    this.repository = getRepository(User);
    this.repository_address = getRepository(Address);
    this.repository_user_address = getRepository(UserAddress);
  }
  async createUserAddress({
    user,
    zipcode,
    street,
    state,
    number,
    district,
    country,
    city,
  }: ICreateUserAddressClientDTO): Promise<User> {
    const address_exist = await this.repository_address.findOne({
      where: { street, number, zipcode, city },
    });

    if (address_exist) {
      const user_addresses = user;
      user_addresses.addresses = [address_exist];

      await this.repository.save(user_addresses);

      return user_addresses;
    }
    const user_addresses = user;
    user_addresses.addresses = [address_exist];

    await this.repository.save(user_addresses);

    return user_addresses;
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
    const user = this.repository.create({
      name,
      last_name,
      email,
      cpf,
      rg,
      birth_date,
      password_hash: password,
    });

    await this.repository.save(user);

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    return this.repository.findOne({ email });
  }

  async findById(id: string): Promise<User> {
    return this.repository.findOne(id);
  }

  async findByRg(rg: string): Promise<User> {
    return this.repository.findOne({ rg });
  }

  async findByCpf(cpf: string): Promise<User> {
    return this.repository.findOne({ cpf });
  }

  async findUserByEmailCpfRg({
    email,
    rg,
    cpf,
  }: IFindUserEmailCpfRgDTO): Promise<User> {
    return this.repository.findOne({ where: [{ email }, { cpf }, { rg }] });
  }
}
export { UsersRepository };
