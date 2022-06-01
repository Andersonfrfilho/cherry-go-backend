import { instanceToInstance } from "class-transformer";
import { inject, injectable } from "tsyringe";

import { config } from "@config/environment";
import {
  AuthenticateUserProviderServiceDTO,
  AuthenticateUserProviderServiceResponseDTO,
} from "@modules/accounts/dtos";
import { TYPE_USER_TOKEN_ENUM } from "@modules/accounts/enums/TypeUserToken.enum";
import { USER_TYPES_ENUM } from "@modules/accounts/enums/UserTypes.enum";
import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";
import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/Providers.repository.interface";
import { UsersTokensRepositoryInterface } from "@modules/accounts/repositories/UsersTokens.repository.interface";
import { DateProviderInterface } from "@shared/container/providers/DateProvider/Date.provider.interface";
import { HashProviderInterface } from "@shared/container/providers/HashProvider/Hash.provider.interface";
import { JwtProviderInterface } from "@shared/container/providers/JwtProvider/Jwt.provider.interface";
import { AppError } from "@shared/errors/AppError";
import {
  BAD_REQUEST,
  FORBIDDEN,
  NOT_FOUND,
  UNAUTHORIZED,
} from "@shared/errors/constants";

@injectable()
export class AuthenticateUserProviderService {
  constructor(
    @inject("ProvidersRepository")
    private providersRepository: ProvidersRepositoryInterface,
    @inject("UsersTokensRepository")
    private usersTokensRepository: UsersTokensRepositoryInterface,
    @inject("HashProvider")
    private hashProvider: HashProviderInterface,
    @inject("DateProvider")
    private dateProvider: DateProviderInterface,
    @inject("JwtProvider")
    private jwtProvider: JwtProviderInterface
  ) {}
  async execute({
    email,
    password,
  }: AuthenticateUserProviderServiceDTO): Promise<AuthenticateUserProviderServiceResponseDTO> {
    const provider = (await this.providersRepository.findByEmail(
      email
    )) as Provider;

    const { expires_in, secret } = config.auth;

    if (!provider) {
      throw new AppError(NOT_FOUND.PROVIDER_DOES_NOT_EXIST);
    }

    if (
      !provider.types.some(
        (type) => type.user_type.name === USER_TYPES_ENUM.PROVIDER
      )
    ) {
      throw new AppError(FORBIDDEN.PROVIDER_IS_NOT_ACTIVE);
    }

    const passwordHash = await this.hashProvider.compareHash(
      password,
      provider.password_hash
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
            id: provider.id,
            active: provider.active,
            types: provider.types,
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
            id: provider.id,
            active: provider.active,
            types: provider.types,
          },
        },
        expiresIn: expires_in.refresh,
      },
    });
    const refresh_token_expires_date = this.dateProvider.addDays(
      expires_in.refresh_days
    );
    await this.usersTokensRepository.create({
      user_id: provider.id,
      expires_date: refresh_token_expires_date,
      refresh_token,
      type: TYPE_USER_TOKEN_ENUM.AUTH_SESSION_TOKEN,
    });

    return {
      provider: instanceToInstance(provider),
      token,
      refresh_token,
    };
  }
}
