import { inject, injectable } from "tsyringe";

import auth from "@config/auth";
import { ConfirmAccountPhoneUserServiceDTO } from "@modules/accounts/dtos";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { UsersTokensRepositoryInterface } from "@modules/accounts/repositories/UsersTokens.repository.interface";
import { DateProviderInterface } from "@shared/container/providers/DateProvider/Date.provider.interface";
import { HashProviderInterface } from "@shared/container/providers/HashProvider/Hash.provider.interface";
import { JwtProviderInterface } from "@shared/container/providers/JwtProvider/Jwt.provider.interface";
import { AppError } from "@shared/errors/AppError";
import {
  METHOD_NOT_ALLOWED,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY,
} from "@shared/errors/constants";

@injectable()
export class ConfirmPhonesUserInsideService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface,
    @inject("UsersTokensRepository")
    private usersTokensRepository: UsersTokensRepositoryInterface,
    @inject("DateProvider")
    private dateProvider: DateProviderInterface,
    @inject("JwtProvider")
    private jwtProvider: JwtProviderInterface,
    @inject("HashProvider")
    private hashProvider: HashProviderInterface
  ) {}
  async execute({
    code,
    token,
    user_id,
  }: ConfirmAccountPhoneUserServiceDTO): Promise<void> {
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
      id: sub.user.id,
      active: passed,
    });
  }
}
