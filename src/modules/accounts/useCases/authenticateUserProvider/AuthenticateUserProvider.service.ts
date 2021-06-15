import { inject, injectable } from "tsyringe";

import auth from "@config/auth";
import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";
import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/ProvidersRepository.interface";
import { UsersTokensRepositoryInterface } from "@modules/accounts/repositories/UsersTokensRepository.interface";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IHashProvider } from "@shared/container/providers/HashProvider/IHashProvider";
import { IJwtProvider } from "@shared/container/providers/JwtProvider/IJwtProvider";
import { AppError } from "@shared/errors/AppError";
import { BAD_REQUEST, UNAUTHORIZED } from "@shared/errors/constants";

interface IResponse {
  user: Provider;
  token: string;
  refresh_token: string;
}
interface IRequest {
  email: string;
  password: string;
}
@injectable()
class AuthenticateUserProviderService {
  constructor(
    @inject("ProvidersRepository")
    private providersRepository: ProvidersRepositoryInterface,
    @inject("UsersTokensRepository")
    private usersTokensRepository: UsersTokensRepositoryInterface,
    @inject("HashProvider")
    private hashProvider: IHashProvider,
    @inject("DateProvider")
    private dateProvider: IDateProvider,
    @inject("JwtProvider")
    private jwtProvider: IJwtProvider
  ) {}
  async execute({ email, password }: IRequest): Promise<IResponse> {
    const provider = await this.providersRepository.findByEmail(email);
    const { expires_in, secret } = auth;

    if (!provider) {
      throw new AppError(BAD_REQUEST.PROVIDER_NOT_EXIST);
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
