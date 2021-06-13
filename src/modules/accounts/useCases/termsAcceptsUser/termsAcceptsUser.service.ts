import { inject, injectable } from "tsyringe";

import { TermsAcceptUserServiceDTO } from "@modules/accounts/dtos/TermsAcceptUserService.dto";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";

@injectable()
class TermsAcceptUserService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}
  async execute({ accept, user_id }: TermsAcceptUserServiceDTO): Promise<void> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(NOT_FOUND.USER_DOES_NOT_EXIST);
    }

    await this.usersRepository.acceptTerms({ user_id, accept });
  }
}
export { TermsAcceptUserService };
