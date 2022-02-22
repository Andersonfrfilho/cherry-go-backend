import { instanceToInstance } from "class-transformer";
import { inject, injectable } from "tsyringe";

import { config } from "@config/environment";
import {
  PaginationPropsDTO,
  PaginationResponsePropsDTO,
} from "@modules/accounts/dtos/repositories/PaginationProps.dto";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { Tag } from "@modules/tags/infra/typeorm/entities/Tag";
import { TarifeService } from "@modules/tariffs/infra/typeorm/entities/TariffsServices";
import { TariffsServicesRepository } from "@modules/tariffs/infra/typeorm/repositories/Tarife.repository";
import { TariffsServicesRepositoryInterface } from "@modules/tariffs/repositories/TarifeService.repository.interface";
import { CacheProviderInterface } from "@shared/container/providers/CacheProvider/Cache.provider.interface";
import { IOREDIS_EXPIRED_ENUM } from "@shared/container/providers/CacheProvider/ioredis.cache.enums";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";

@injectable()
export class GetTariffsServices {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface,
    @inject("TariffsServicesRepository")
    private tariffsServicesRepository: TariffsServicesRepositoryInterface,
    @inject("CacheProvider")
    private cacheProvider: CacheProviderInterface
  ) {}
  async execute(id: string): Promise<TarifeService[]> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppError(NOT_FOUND.USER_DOES_NOT_EXIST);
    }

    const tariffsCache = await this.cacheProvider.recover<TarifeService[]>(
      "tariffs"
    );

    if (tariffsCache) {
      return tariffsCache;
    }

    const tariffs = await this.tariffsServicesRepository.getAllTariffs();

    await this.cacheProvider.save(
      "tariffs",
      tariffs,
      IOREDIS_EXPIRED_ENUM.EX,
      config.address.cache.invalidade.time
    );

    return tariffs;
  }
}
