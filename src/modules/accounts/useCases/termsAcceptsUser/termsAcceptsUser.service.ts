import { inject, injectable } from "tsyringe";

import { TermsAcceptUserServiceDTO } from "@modules/accounts/dtos/TermsAcceptUserService.dto";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";

@injectable()
class TermsAcceptUserService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}
  async execute({ accept, user_id }: TermsAcceptUserServiceDTO): Promise<void> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError({ message: "User not exist!" });
    }

    await this.usersRepository.acceptTerms({ user_id, accept });
  }
}
export { TermsAcceptUserService };
