import { inject, injectable } from "tsyringe";

import auth from "@config/auth";
import { UsersTokensRepositoryInterface } from "@modules/accounts/repositories/UsersTokens.repository.interface";
import { DateProviderInterface } from "@shared/container/providers/DateProvider/Date.provider.interface";
import { JwtProviderInterface } from "@shared/container/providers/JwtProvider/Jwt.provider.interface";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";

interface ITokenResponse {
  token: string;
  refresh_token: string;
}
@injectable()
class RefreshTokenService {
  constructor(
    @inject("UsersTokensRepository")
    private usersTokensRepository: UsersTokensRepositoryInterface,
    @inject("DateProvider")
    private dateProvider: DateProviderInterface,
    @inject("JwtProvider")
    private jwtProvider: JwtProviderInterface
  ) {}
  async execute(refresh_token: string): Promise<ITokenResponse> {
    const { email, sub } = this.jwtProvider.verifyJwt({
      auth_secret: auth.secret.refresh,
      token: refresh_token,
    });
    const user_refresh_token = await this.usersTokensRepository.findByUserIdAndRefreshToken(
      { user_id: sub.user.id, refresh_token }
    );

    if (!user_refresh_token) {
      throw new AppError(NOT_FOUND.REFRESH_TOKEN_DOES_NOT_EXIST);
    }

    await this.usersTokensRepository.deleteById(user_refresh_token.id);

    const new_refresh_token = this.jwtProvider.assign({
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
      refresh_token: new_refresh_token,
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
      refresh_token: new_refresh_token,
      token: new_token,
    };
  }
}

export { RefreshTokenService };
