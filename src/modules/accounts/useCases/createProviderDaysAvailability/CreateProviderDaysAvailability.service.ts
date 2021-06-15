import { inject, injectable } from "tsyringe";

import { UsersRepositoryInterface } from "@modules/accounts/repositories/UsersRepository.interface";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";

@injectable()
class CreateProviderDaysAvailability {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface
  ) {}
  async execute(user_id: string): Promise<void> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(NOT_FOUND.USER_DOES_NOT_EXIST);
    }

    await this.usersRepository.providerTypeForUser({ active: true, user_id });
  }
}
export { CreateProviderDaysAvailability };
