import { instanceToInstance } from "class-transformer";
import { inject, injectable } from "tsyringe";

import { config } from "@config/environment";
import { AuthenticateUserProviderServiceResponseDTO } from "@modules/accounts/dtos";
import { USER_TYPES_ENUM } from "@modules/accounts/enums/UserTypes.enum";
import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";
import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/Providers.repository.interface";
import { UsersTokensRepositoryInterface } from "@modules/accounts/repositories/UsersTokens.repository.interface";
import { DateProviderInterface } from "@shared/container/providers/DateProvider/Date.provider.interface";
import { HashProviderInterface } from "@shared/container/providers/HashProvider/Hash.provider.interface";
import { JwtProviderInterface } from "@shared/container/providers/JwtProvider/Jwt.provider.interface";
import { AppError } from "@shared/errors/AppError";
import { FORBIDDEN, NOT_FOUND } from "@shared/errors/constants";

@injectable()
export class MeProfileUserProviderService {
  constructor(
    @inject("ProvidersRepository")
    private providersRepository: ProvidersRepositoryInterface,
    @inject("UsersTokensRepository")
    private usersTokensRepository: UsersTokensRepositoryInterface,
    @inject("DateProvider")
    private dateProvider: DateProviderInterface,
    @inject("JwtProvider")
    private jwtProvider: JwtProviderInterface
  ) {}
  async execute(
    id: string
  ): Promise<AuthenticateUserProviderServiceResponseDTO> {
    const provider = await this.providersRepository.findById({ id });

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
      payload: { email: provider.email },
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

    const { results } = await this.providersRepository.findAppointments({
      provider_id: provider.id,
    });

    return {
      provider: { ...instanceToInstance(provider), appointments: results },
      token,
      refresh_token,
    };
  }
}
