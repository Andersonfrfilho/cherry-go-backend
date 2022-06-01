import { instanceToInstance } from "class-transformer";
import { inject, injectable } from "tsyringe";

import { config } from "@config/environment";
import { TYPE_USER_TOKEN_ENUM } from "@modules/accounts/enums/TypeUserToken.enum";
import { DocumentUserImage } from "@modules/accounts/infra/typeorm/entities/DocumentUserImage";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { UsersTokensRepositoryInterface } from "@modules/accounts/repositories/UsersTokens.repository.interface";
import { DateProviderInterface } from "@shared/container/providers/DateProvider/Date.provider.interface";
import { HashProviderInterface } from "@shared/container/providers/HashProvider/Hash.provider.interface";
import { JwtProviderInterface } from "@shared/container/providers/JwtProvider/Jwt.provider.interface";
import { AppError } from "@shared/errors/AppError";
import { FORBIDDEN, NOT_FOUND, UNAUTHORIZED } from "@shared/errors/constants";
import { onlyNumber } from "@utils/onlyNumber";

interface DocumentsAuthResponse {
  front: boolean;
  back: boolean;
}
interface UserAuthResponse extends User {
  documents: DocumentUserImage[] | DocumentsAuthResponse;
}
interface IResponse {
  user: UserAuthResponse;
  token: string;
  refresh_token: string;
  token_expires_date: number;
  refresh_token_expires_date: number;
}
interface IRequest {
  email: string;
  password: string;
}
@injectable()
export class AuthenticateUserService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface,
    @inject("UsersTokensRepository")
    private usersTokensRepository: UsersTokensRepositoryInterface,
    @inject("HashProvider")
    private hashProvider: HashProviderInterface,
    @inject("DateProvider")
    private dateProvider: DateProviderInterface,
    @inject("JwtProvider")
    private jwtProvider: JwtProviderInterface
  ) {}
  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);
    const {
      auth: { secret, expires_in },
    } = config;

    if (!user) {
      throw new AppError(NOT_FOUND.USER_DOES_NOT_EXIST);
    }

    if (!user.active) {
      throw new AppError(FORBIDDEN.USER_IS_NOT_ACTIVE);
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
          user: {
            id: user.id,
            active: user.active,
            types: user.types,
          },
        },
        expiresIn: expires_in.token,
      },
    });

    const refresh_token = this.jwtProvider.assign({
      payload: { email },
      secretOrPrivateKey: secret.refresh,
      options: {
        subject: {
          user: {
            id: user.id,
            active: user.active,
            types: user.types,
          },
        },
        expiresIn: expires_in.refresh,
      },
    });

    const refresh_token_expires_date = this.dateProvider.addDays(
      expires_in.refresh_days
    );
    await this.usersTokensRepository.deleteByUserIdType({
      user_id: user.id,
      type: TYPE_USER_TOKEN_ENUM.AUTH_SESSION_TOKEN,
    });

    await this.usersTokensRepository.create({
      user_id: user.id,
      expires_date: refresh_token_expires_date,
      refresh_token,
      type: TYPE_USER_TOKEN_ENUM.AUTH_SESSION_TOKEN,
    });

    const token_day = onlyNumber(expires_in.token);
    const refresh_token_day = onlyNumber(expires_in.refresh);

    return {
      user: {
        ...instanceToInstance(user),
        documents: {
          front: user.documents.length > 0,
          back: user.documents.length > 0,
        },
      },
      token,
      refresh_token,
      token_expires_date: Number(token_day) * 24 * 60 * 60,
      refresh_token_expires_date: Number(refresh_token_day) * 24 * 60 * 60,
    };
  }
}
