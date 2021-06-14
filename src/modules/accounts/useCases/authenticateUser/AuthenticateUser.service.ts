import { inject, injectable } from "tsyringe";

import auth from "@config/auth";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IHashProvider } from "@shared/container/providers/HashProvider/IHashProvider";
import { IJwtProvider } from "@shared/container/providers/JwtProvider/IJwtProvider";
import { AppError } from "@shared/errors/AppError";
import { BAD_REQUEST, UNAUTHORIZED } from "@shared/errors/constants";

interface IResponse {
  user: User;
  token: string;
  refresh_token: string;
}
interface IRequest {
  email: string;
  password: string;
}
@injectable()
class AuthenticateUserService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository,
    @inject("HashProvider")
    private hashProvider: IHashProvider,
    @inject("DateProvider")
    private dateProvider: IDateProvider,
    @inject("JwtProvider")
    private jwtProvider: IJwtProvider
  ) {}
  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);
    const { expires_in, secret } = auth;

    if (!user) {
      throw new AppError(BAD_REQUEST.USER_NOT_EXIST);
    }
    const passwordHash = await this.hashProvider.compareHash(
      password,
      user.password_hash
    );

    if (!passwordHash) {
      throw new AppError(UNAUTHORIZED.USER_PASSWORD_DOES_MATCH);
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
      payload: { email },
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
export { AuthenticateUserService };
