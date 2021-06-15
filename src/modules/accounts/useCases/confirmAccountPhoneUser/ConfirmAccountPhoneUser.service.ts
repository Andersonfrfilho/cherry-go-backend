import { inject, injectable } from "tsyringe";

import auth from "@config/auth";
import { ConfirmAccountPhoneUserDTO } from "@modules/accounts/dtos";
import { UsersTokensRepositoryInterface } from "@modules/accounts/repositories/UsersTokensRepository.interface";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/UsersRepository.interface";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IHashProvider } from "@shared/container/providers/HashProvider/IHashProvider";
import { IJwtProvider } from "@shared/container/providers/JwtProvider/IJwtProvider";
import { AppError } from "@shared/errors/AppError";
import {
  METHOD_NOT_ALLOWED,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY,
} from "@shared/errors/constants";

@injectable()
class ConfirmAccountPhoneUserService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface,
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
      throw new AppError(METHOD_NOT_ALLOWED.NOT_ALLOWED);
    }

    if (
      this.dateProvider.compareIfBefore(user_token.expires_date, new Date())
    ) {
      throw new AppError(UNAUTHORIZED.TOKEN_EXPIRED);
    }

    await this.usersTokensRepository.deleteById(user_token.id);

    const passed = await this.hashProvider.compareHash(code, sub.code_hash);

    if (!passed) {
      throw new AppError(UNPROCESSABLE_ENTITY.CODE_INCORRECT);
    }

    await this.usersRepository.updateActivePhoneUser({
      user_id: sub.user.id,
      active: passed,
    });
  }
}
export { ConfirmAccountPhoneUserService };
