import { classToClass } from "class-transformer";
import { inject, injectable } from "tsyringe";

import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";

@injectable()
export class ShowUsersService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface
  ) {}
  async execute(id: string): Promise<User> {
    const users = await this.usersRepository.findById(id);

    return classToClass(users);
  }
}
