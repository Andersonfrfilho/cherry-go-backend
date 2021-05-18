import { inject, injectable } from "tsyringe";

import { ICreateUserClientDTO } from "@modules/accounts/dtos";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { User } from "@sentry/node";
import { IHashProvider } from "@shared/container/providers/HashProvider/IHashProvider";
import { AppError } from "@shared/errors/AppError";

@injectable()
class CreateUserClientUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("HashProvider")
    private hashProvider: IHashProvider
  ) {}
  async execute({
    name,
    last_name,
    cpf,
    rg,
    email,
    password,
    birth_date,
  }: ICreateUserClientDTO): Promise<User> {
    const userAlreadyExists = await this.usersRepository.findUserByEmailCpfRg({
      email,
      cpf,
      rg,
    });

    if (userAlreadyExists) {
      throw new AppError("User client already exist");
    }

    const password_hash = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      last_name,
      cpf,
      rg,
      email,
      password: password_hash,
      birth_date,
    });

    return user;
  }
}
export { CreateUserClientUseCase };
