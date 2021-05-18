import { getRepository, Repository } from "typeorm";

import { ICreateUserClientDTO } from "@modules/accounts/dtos/ICreateUserClientDTO";
import { IFindUserEmailCpfRgDTO } from "@modules/accounts/dtos/IFindUserEmailCpfRgDTO";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";

class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
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
