import { instanceToInstance } from "class-transformer";
import { inject, injectable } from "tsyringe";

import auth from "@config/auth";
import { DocumentUserImage } from "@modules/accounts/infra/typeorm/entities/DocumentUserImage";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { UsersTokensRepositoryInterface } from "@modules/accounts/repositories/UsersTokens.repository.interface";
import { DateProviderInterface } from "@shared/container/providers/DateProvider/Date.provider.interface";
import { HashProviderInterface } from "@shared/container/providers/HashProvider/Hash.provider.interface";
import { JwtProviderInterface } from "@shared/container/providers/JwtProvider/Jwt.provider.interface";
import { AppError } from "@shared/errors/AppError";
import { FORBIDDEN, NOT_FOUND, UNAUTHORIZED } from "@shared/errors/constants";

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
    const { expires_in, secret } = auth;

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
      secretOrPrivateKey: auth.secret.refresh,
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

    await this.usersTokensRepository.create({
      user_id: user.id,
      expires_date: refresh_token_expires_date,
      refresh_token,
    });

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
    };
  }
}
