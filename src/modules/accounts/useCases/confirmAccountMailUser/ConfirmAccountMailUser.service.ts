import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { HttpErrorCodes } from "@shared/enums/statusCode";
import { AppError } from "@shared/errors/AppError";

@injectable()
class ConfirmAccountMailUserService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository,
    @inject("DateProvider")
    private dateProvider: IDateProvider
  ) {}
  async execute(token: string): Promise<void> {
    const user_token = await this.usersTokensRepository.findByRefreshToken(
      token
    );

    if (!user_token) {
      throw new AppError({ message: "Token invalid!" });
    }

    if (
      this.dateProvider.compareIfBefore(user_token.expires_date, new Date())
    ) {
      throw new AppError({
        message: "Token expired!",
        status_code: HttpErrorCodes.UNAUTHORIZED,
      });
    }

    await this.usersRepository.updateActiveUser({
      id: user_token.user_id,
      active: true,
    });
  }
}
export { ConfirmAccountMailUserService };
