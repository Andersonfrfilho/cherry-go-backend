import { getRepository, Repository } from "typeorm";

import { ICreateUserAddressClientDTO } from "@modules/accounts/dtos";
import { ICreateUserClientDTO } from "@modules/accounts/dtos/ICreateUserClientDTO";
import { IFindUserEmailCpfRgDTO } from "@modules/accounts/dtos/IFindUserEmailCpfRgDTO";
import { IUpdatedUserClientDTO } from "@modules/accounts/dtos/IUpdatedUserClient.dto";
import { Address } from "@modules/accounts/infra/typeorm/entities/Address";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";

class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;
  private repository_address: Repository<Address>;

  constructor() {
    this.repository = getRepository(User);
    this.repository_address = getRepository(Address);
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

      const user_saved = await this.repository.save(user_addresses);

      return user_saved;
    }
    const address = this.repository_address.create({
      zipcode,
      street,
      state,
      number,
      district,
      country,
      city,
    });
    const user_address = this.repository.create({
      ...user,
      addresses: [address],
    });

    const user_saved = await this.repository.save(user_address);

    return user_saved;
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
  async updatePasswordUser({
    id,
    password_hash,
  }: IUpdatedUserClientDTO): Promise<any> {
    const user = await this.repository.update(id, {
      password_hash,
    });
    return user;
  }
}
export { UsersRepository };
