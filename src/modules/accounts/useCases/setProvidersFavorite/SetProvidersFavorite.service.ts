import { inject, injectable } from "tsyringe";

import { config } from "@config/environment";
import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/Providers.repository.interface";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { CacheProviderInterface } from "@shared/container/providers/CacheProvider/Cache.provider.interface";
import { IOREDIS_EXPIRED_ENUM } from "@shared/container/providers/CacheProvider/ioredis.cache.enums";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";

interface ParamDTO {
  user_id: string;
  provider_id: string;
}

@injectable()
export class SetProvidersFavoriteService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface,
    @inject("ProvidersRepository")
    private providersRepository: ProvidersRepositoryInterface,
    @inject("CacheProvider")
    private cacheProvider: CacheProviderInterface
  ) {}
  async execute({ user_id, provider_id }: ParamDTO): Promise<void> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(NOT_FOUND.USER_DOES_NOT_EXIST);
    }

    const provider = await this.providersRepository.findById(provider_id);

    if (!provider) {
      throw new AppError(NOT_FOUND.PROVIDER_DOES_NOT_EXIST);
    }

    const favorites_cache = await this.cacheProvider.recover<string[]>(
      `client:${user.id}:favorites`
    );

    if (!!favorites_cache && favorites_cache.length > 0) {
      await this.cacheProvider.save(
        `client:${user.id}:favorites`,
        [...favorites_cache, provider.id],
        IOREDIS_EXPIRED_ENUM.EX,
        config.client.cache.invalidade.time
      );
    } else {
      await this.cacheProvider.save(
        `client:${user.id}:favorites`,
        [provider.id],
        IOREDIS_EXPIRED_ENUM.EX,
        config.client.cache.invalidade.time
      );
    }
  }
}
