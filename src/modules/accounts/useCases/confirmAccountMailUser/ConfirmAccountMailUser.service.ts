import { inject, injectable } from "tsyringe";

import { UsersRepositoryInterface } from "@modules/accounts/repositories/UsersRepository.interface";
import { UsersTokensRepositoryInterface } from "@modules/accounts/repositories/UsersTokensRepository.interface";
import { DateProviderInterface } from "@shared/container/providers/DateProvider/DateProvider.interface";
import { AppError } from "@shared/errors/AppError";
import { FORBIDDEN, UNAUTHORIZED } from "@shared/errors/constants";

@injectable()
class ConfirmAccountMailUserService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface,
    @inject("UsersTokensRepository")
    private usersTokensRepository: UsersTokensRepositoryInterface,
    @inject("DateProvider")
    private dateProvider: DateProviderInterface
  ) {}
  async execute(token: string): Promise<void> {
    const user_token = await this.usersTokensRepository.findByRefreshToken(
      token
    );

    if (!user_token) {
      throw new AppError(FORBIDDEN.TOKEN_INVALID);
    }

    if (
      this.dateProvider.compareIfBefore(user_token.expires_date, new Date())
    ) {
      throw new AppError(UNAUTHORIZED.TOKEN_EXPIRED);
    }

    await this.usersRepository.updateActiveUser({
      id: user_token.user_id,
      active: true,
    });
  }
}
export { ConfirmAccountMailUserService };
