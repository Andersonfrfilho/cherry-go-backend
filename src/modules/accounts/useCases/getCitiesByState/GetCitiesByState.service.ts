import { inject, injectable } from "tsyringe";

import { config } from "@config/environment";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { Address } from "@modules/addresses/infra/typeorm/entities/Address";
import { AddressProviderInterface } from "@shared/container/providers/AddressProvider/Address.provider.interface";
import { State } from "@shared/container/providers/AddressProvider/implementations/Address.provider";
import { CacheProviderInterface } from "@shared/container/providers/CacheProvider/Cache.provider.interface";
import { IOREDIS_EXPIRED_ENUM } from "@shared/container/providers/CacheProvider/ioredis.cache.enums";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";

interface ParamsDTO {
  user_id: string;
  state: string;
}
@injectable()
export class GetCitiesByStateService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface,
    @inject("AddressProvider")
    private addressProvider: AddressProviderInterface,
    @inject("CacheProvider")
    private cacheProvider: CacheProviderInterface
  ) {}
  async execute({ user_id, state }: ParamsDTO): Promise<State[]> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(NOT_FOUND.USER_DOES_NOT_EXIST);
    }
    await this.cacheProvider.invalidateAll();

    const cities_by_state_cache = await this.cacheProvider.recover(
      `address_provider:states:${state}:cities`
    );

    if (cities_by_state_cache) {
      return cities_by_state_cache;
    }

    const cities = await this.addressProvider.getCitiesByState(state);

    await this.cacheProvider.save(
      `address_provider:states:${state}:cities`,
      cities,
      IOREDIS_EXPIRED_ENUM.EX,
      config.address.cache.invalidade.time
    );

    return cities;
  }
}
