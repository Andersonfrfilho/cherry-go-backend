import { inject, injectable } from "tsyringe";

import auth from "@config/auth";
import {
  AuthenticateUserProviderServiceDTO,
  AuthenticateUserProviderServiceResponseDTO,
} from "@modules/accounts/dtos";
import { UserTypesEnum } from "@modules/accounts/enums/UserTypes.enum";
import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/Providers.repository.interface";
import { UsersTokensRepositoryInterface } from "@modules/accounts/repositories/UsersTokens.repository.interface";
import { DateProviderInterface } from "@shared/container/providers/DateProvider/Date.provider.interface";
import { HashProviderInterface } from "@shared/container/providers/HashProvider/Hash.provider.interface";
import { JwtProviderInterface } from "@shared/container/providers/JwtProvider/Jwt.provider.interface";
import { AppError } from "@shared/errors/AppError";
import { BAD_REQUEST, FORBIDDEN, UNAUTHORIZED } from "@shared/errors/constants";

@injectable()
class AuthenticateUserProviderService {
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
    const provider = await this.providersRepository.findByEmail(email);
    const { expires_in, secret } = auth;

    if (!provider) {
      throw new AppError(BAD_REQUEST.PROVIDER_NOT_EXIST);
    }

    if (!provider.types.some((type) => type.name === UserTypesEnum.PROVIDER)) {
      throw new AppError(FORBIDDEN.PROVIDER_IS_NOT_ACTIVE);
    }

    const passwordHash = await this.hashProvider.compareHash(
      password,
      provider.password_hash
    );

    if (!passwordHash) {
      throw new AppError(UNAUTHORIZED.PROVIDER_PASSWORD_DOES_MATCH);
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
    });

    return {
      user: provider,
      token,
      refresh_token,
    };
  }
}
export { AuthenticateUserProviderService };
