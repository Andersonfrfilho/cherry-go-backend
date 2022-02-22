import { inject, injectable } from "tsyringe";

import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/Providers.repository.interface";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { CacheProviderInterface } from "@shared/container/providers/CacheProvider/Cache.provider.interface";
import { AppError } from "@shared/errors/AppError";
import { BAD_REQUEST, NOT_FOUND } from "@shared/errors/constants";

interface ParamDTO {
  user_id: string;
  provider_id: string;
  value: string;
  details: any;
}
@injectable()
export class RatingProvidersService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface,
    @inject("ProvidersRepository")
    private providersRepository: ProvidersRepositoryInterface,
    @inject("CacheProvider")
    private cacheProvider: CacheProviderInterface
  ) {}
  async execute({
    user_id,
    details,
    provider_id,
    value,
  }: ParamDTO): Promise<void> {
    if (provider_id === user_id) {
      throw new AppError(BAD_REQUEST.ACCOUNT_NOT_RATING_IN_SAME_ACCOUNT);
    }

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(NOT_FOUND.USER_DOES_NOT_EXIST);
    }

    const provider = await this.providersRepository.findById({id:provider_id});

    if (!provider) {
      throw new AppError(NOT_FOUND.PROVIDER_DOES_NOT_EXIST);
    }

    await this.usersRepository.ratingProvider({
      client_id: user.id,
      provider_id: provider.id,
      value: Number(value),
      details,
    });
  }
}
