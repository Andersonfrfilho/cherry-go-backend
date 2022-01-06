import { classToClass } from "class-transformer";
import { inject, injectable } from "tsyringe";

import { config } from "@config/environment";
import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";
import { ProviderAddress } from "@modules/accounts/infra/typeorm/entities/ProviderAddress";
import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/Providers.repository.interface";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { CacheProviderInterface } from "@shared/container/providers/CacheProvider/Cache.provider.interface";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";
import { distanceRadiusCalculation } from "@utils/distanceByRadius";

export interface ProviderGeolocationCache {
  provider_id: string;
  latitude: string;
  longitude: string;
}
interface ParamDTO {
  user_id: string;
  latitude: string;
  longitude: string;
  distance: string;
}
@injectable()
export class GetProvidersService {
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
    distance,
    latitude,
    longitude,
  }: ParamDTO): Promise<Provider[]> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(NOT_FOUND.USER_DOES_NOT_EXIST);
    }

    const providers_found = await this.providersRepository.findByArea({
      city: user.addresses[0].city,
      user_id: user.id,
      distance,
    });

    const providers_cache = await this.cacheProvider.recover<
      ProviderGeolocationCache[]
    >("providers:*:geolocation");

    let provider_filtered_cache = [];

    if (!!providers_cache && providers_cache.length > 0) {
      provider_filtered_cache = providers_cache.filter(
        (provider_cache) =>
          !providers_found.some(
            (provider_found) => provider_found.id === provider_cache.provider_id
          )
      );
    }

    let providers_by_location = [];

    if (provider_filtered_cache.length > 0) {
      const providers_available_location = provider_filtered_cache
        .filter((provider) =>
          distanceRadiusCalculation({
            distance: Number(distance),
            latitude: Number(provider.latitude),
            longitude: Number(provider.longitude),
            currentLatitude: Number(latitude),
            currentLongitude: Number(longitude),
          })
        )
        .map((provider_cache) => provider_cache.provider_id);

      providers_by_location = await this.providersRepository.findByIds(
        providers_available_location
      );
    }

    const providers_favorites_cache =
      (await this.cacheProvider.recover<string[]>(
        `providers:${user_id}:favorites`
      )) || [];

    const formatted_providers = [
      ...providers_found,
      ...providers_by_location,
    ].map((provider) => ({
      ...provider,
      favorite: providers_favorites_cache.some(
        (provider_favorite_id) => provider_favorite_id === provider.id
      ),
      ratings:
        provider.ratings.length > 0
          ? Number.parseInt(
              provider.ratings.reduce(
                (previousValue, currentValue) =>
                  Number(previousValue) + Number(currentValue.value),
                0
              ) / provider.ratings.length,
              10
            )
          : 0,
    }));

    return classToClass(formatted_providers);
  }
}
