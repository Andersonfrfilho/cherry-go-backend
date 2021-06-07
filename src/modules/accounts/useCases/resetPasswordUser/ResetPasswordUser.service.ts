import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IHashProvider } from "@shared/container/providers/HashProvider/IHashProvider";
import { HttpErrorCodes } from "@shared/enums/statusCode";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository,
    @inject("DateProvider")
    private dateProvider: IDateProvider,
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("HashProvider")
    private hashProvider: IHashProvider
  ) {}
  async execute({ token, password }: IRequest): Promise<void> {
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

    const password_hash = await this.hashProvider.generateHash(password);

    await this.usersRepository.updatePasswordUser({
      id: user_token.user_id,
      password_hash,
    });

    await this.usersTokensRepository.deleteById(user_token.id);
  }
}
export { ResetPasswordService };
