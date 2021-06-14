import { inject, injectable } from "tsyringe";

import { TermsAcceptUserServiceDTO } from "@modules/accounts/dtos/TermsAcceptUserService.dto";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";

@injectable()
class CreateUsersTypeProviders {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}
  async execute(user_id: string): Promise<void> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(NOT_FOUND.USER_DOES_NOT_EXIST);
    }

    await this.usersRepository.addProviderTypeForUser(user_id);
  }
}
export { CreateUsersTypeProviders };
