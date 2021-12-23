import { inject, injectable } from "tsyringe";

import { config } from "@config/environment";
import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/Providers.repository.interface";
import { CacheProviderInterface } from "@shared/container/providers/CacheProvider/Cache.provider.interface";
import { IOREDIS_EXPIRED_ENUM } from "@shared/container/providers/CacheProvider/ioredis.cache.enums";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";

interface ParamDTO {
  provider_id: string;
  latitude: string;
  longitude: string;
}

@injectable()
export class SetLocationCacheProvidersService {
  constructor(
    @inject("ProvidersRepository")
    private providersRepository: ProvidersRepositoryInterface,
    @inject("CacheProvider")
    private cacheProvider: CacheProviderInterface
  ) {}
  async execute({ provider_id, longitude, latitude }: ParamDTO): Promise<void> {
    const provider = await this.providersRepository.findById(provider_id);

    if (!provider) {
      throw new AppError(NOT_FOUND.USER_DOES_NOT_EXIST);
    }

    await this.cacheProvider.save(
      `providers:${provider.id}:geolocation`,
      { provider_id, longitude, latitude },
      IOREDIS_EXPIRED_ENUM.EX,
      config.geolocation.cache.invalidade.time
    );
  }
}
