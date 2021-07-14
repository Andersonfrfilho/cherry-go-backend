import { inject, injectable } from "tsyringe";

import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";

@injectable()
export class CreateUsersTypeInside {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface
  ) {}
  async execute(user_id: string): Promise<void> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(NOT_FOUND.USER_DOES_NOT_EXIST);
    }

    await this.usersRepository.insideTypeForUser({ active: true, user_id });
  }
}
