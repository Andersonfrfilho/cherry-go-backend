import { inject, injectable } from "tsyringe";

import auth from "@config/auth";
import { ConfirmAccountPhoneUserDTO } from "@modules/accounts/dtos";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IHashProvider } from "@shared/container/providers/HashProvider/IHashProvider";
import { IJwtProvider } from "@shared/container/providers/JwtProvider/IJwtProvider";
import { HttpErrorCodes } from "@shared/enums/statusCode";
import { AppError } from "@shared/errors/AppError";

@injectable()
class ConfirmAccountPhoneUserService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository,
    @inject("DateProvider")
    private dateProvider: IDateProvider,
    @inject("JwtProvider")
    private jwtProvider: IJwtProvider,
    @inject("HashProvider")
    private hashProvider: IHashProvider
  ) {}
  async execute({
    code,
    token,
    user_id,
  }: ConfirmAccountPhoneUserDTO): Promise<void> {
    const user_token = await this.usersTokensRepository.findByRefreshToken(
      token
    );
    const { sub } = this.jwtProvider.verifyJwt({
      auth_secret: auth.secret.refresh,
      token: user_token.refresh_token,
    });

    if (!(user_id === sub.user.id)) {
      throw new AppError({
        message: "Not authorized!",
        status_code: HttpErrorCodes.CONFLICT,
      });
    }

    if (
      this.dateProvider.compareIfBefore(user_token.expires_date, new Date())
    ) {
      throw new AppError({
        message: "Token expired!",
        status_code: HttpErrorCodes.UNAUTHORIZED,
      });
    }

    await this.usersTokensRepository.deleteById(user_token.id);

    const passed = await this.hashProvider.compareHash(code, sub.code_hash);

    if (!passed) {
      throw new AppError({
        message: "Code incorrect!",
        status_code: HttpErrorCodes.CONFLICT,
      });
    }

    await this.usersRepository.updateActivePhoneUser({
      user_id: sub.user.id,
      active: passed,
    });
  }
}
export { ConfirmAccountPhoneUserService };
