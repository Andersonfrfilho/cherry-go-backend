import { inject, injectable } from "tsyringe";

import { config } from "@config/environment";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { UsersTokensRepositoryInterface } from "@modules/accounts/repositories/UsersTokens.repository.interface";
import { DateProviderInterface } from "@shared/container/providers/DateProvider/Date.provider.interface";
import { JwtProviderInterface } from "@shared/container/providers/JwtProvider/Jwt.provider.interface";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";

interface IResponse {
  user: User;
  token: string;
  refresh_token: string;
}

@injectable()
export class MeUserProfileService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface,
    @inject("UsersTokensRepository")
    private usersTokensRepository: UsersTokensRepositoryInterface,
    @inject("DateProvider")
    private dateProvider: DateProviderInterface,
    @inject("JwtProvider")
    private jwtProvider: JwtProviderInterface
  ) {}
  async execute(id: string): Promise<IResponse> {
    const user = await this.usersRepository.findById(id);

    const { expires_in, secret } = config.auth;

    if (!user) {
      throw new AppError(NOT_FOUND.USER_DOES_NOT_EXIST);
    }

    const token = this.jwtProvider.assign({
      payload: {},
      secretOrPrivateKey: secret.token,
      options: {
        subject: {
          user: { id: user.id, active: user.active, types: user.types },
        },
        expiresIn: expires_in.token,
      },
    });

    const refresh_token = this.jwtProvider.assign({
      payload: { email: user.email },
      secretOrPrivateKey: secret.refresh,
      options: {
        subject: {
          user: { id: user.id, active: user.active, types: user.types },
        },
        expiresIn: expires_in.refresh,
      },
    });

    const refresh_token_expires_date = this.dateProvider.addDays(
      expires_in.refresh_days
    );

    await this.usersTokensRepository.create({
      user_id: user.id,
      expires_date: refresh_token_expires_date,
      refresh_token,
    });

    return {
      user,
      token,
      refresh_token,
    };
  }
}
