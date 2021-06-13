import { inject, injectable } from "tsyringe";

import auth from "@config/auth";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IJwtProvider } from "@shared/container/providers/JwtProvider/IJwtProvider";
import { AppError } from "@shared/errors/AppError";
import { FORBIDDEN } from "@shared/errors/constants";

interface ITokenResponse {
  token: string;
  refresh_token: string;
}
@injectable()
class RefreshTokenService {
  constructor(
    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository,
    @inject("DateProvider")
    private dateProvider: IDateProvider,
    @inject("JwtProvider")
    private jwtProvider: IJwtProvider
  ) {}
  async execute(token: string): Promise<ITokenResponse> {
    const { email, sub } = this.jwtProvider.verifyJwt({
      auth_secret: auth.secret.refresh,
      token,
    });

    const userToken = await this.usersTokensRepository.findByUserIdAndRefreshToken(
      sub.user.id,
      token
    );

    if (!userToken) {
      throw new AppError(FORBIDDEN.REFRESH_TOKEN_DOES_NOT_EXIST);
    }

    await this.usersTokensRepository.deleteById(userToken.id);

    const refresh_token = this.jwtProvider.assign({
      payload: { email },
      secretOrPrivateKey: auth.secret.refresh,
      options: {
        expiresIn: auth.expires_in.refresh,
        subject: sub,
      },
    });

    const expires_date = this.dateProvider.addDays(
      auth.expires_in.refresh_days
    );

    await this.usersTokensRepository.create({
      expires_date,
      refresh_token,
      user_id: sub.user.id,
    });

    const new_token = this.jwtProvider.assign({
      payload: {},
      secretOrPrivateKey: auth.secret.token,
      options: {
        expiresIn: auth.expires_in.token,
        subject: sub,
      },
    });

    return {
      refresh_token: new_token,
      token,
    };
  }
}

export { RefreshTokenService };
