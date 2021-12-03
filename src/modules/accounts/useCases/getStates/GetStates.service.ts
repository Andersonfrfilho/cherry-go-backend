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

@injectable()
export class GetStatesService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface,
    @inject("AddressProvider")
    private addressProvider: AddressProviderInterface,
    @inject("CacheProvider")
    private cacheProvider: CacheProviderInterface
  ) {}
  async execute(user_id: string): Promise<State[]> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(NOT_FOUND.USER_DOES_NOT_EXIST);
    }

    const states_cache = await this.cacheProvider.recover(
      "address_provider:states"
    );

    if (states_cache) {
      return states_cache;
    }

    const states = await this.addressProvider.getStates();

    await this.cacheProvider.save(
      "address_provider:states",
      states,
      IOREDIS_EXPIRED_ENUM.EX,
      config.address.cache.invalidade.time
    );

    return states;
  }
}
