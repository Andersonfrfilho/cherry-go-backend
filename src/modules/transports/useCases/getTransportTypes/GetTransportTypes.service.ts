import { classToClass } from "class-transformer";
import { inject, injectable } from "tsyringe";

import { config } from "@config/environment";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { TransportType } from "@modules/transports/infra/typeorm/entities/TransportType";
import { TransportsRepositoryInterface } from "@modules/transports/repositories/Transports.repository.interface";
import { CacheProviderInterface } from "@shared/container/providers/CacheProvider/Cache.provider.interface";
import { IOREDIS_EXPIRED_ENUM } from "@shared/container/providers/CacheProvider/ioredis.cache.enums";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";
import { sortArrayObjects } from "@utils/sortArrayObject";

@injectable()
export class GetTransportTypesService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface,
    @inject("TransportsRepository")
    private transportsRepository: TransportsRepositoryInterface,
    @inject("CacheProvider")
    private cacheProvider: CacheProviderInterface
  ) {}
  async execute(user_id: string): Promise<TransportType[]> {
    const user = await this.usersRepository.findById(user_id);
    await this.cacheProvider.invalidateAll();
    if (!user) {
      throw new AppError(NOT_FOUND.USER_DOES_NOT_EXIST);
    }
    const transport_types_cache = await this.cacheProvider.recover<
      TransportType[]
    >("transport:types");

    if (transport_types_cache) {
      return transport_types_cache;
    }

    const transport_types = await this.transportsRepository.getAllByActiveTransportType(
      true
    );

    const transport_types_format = sortArrayObjects({
      array: transport_types,
      property: "name",
    });

    await this.cacheProvider.save(
      "transport:types",
      classToClass(transport_types_format),
      IOREDIS_EXPIRED_ENUM.EX,
      config.address.cache.invalidade.time
    );

    return classToClass(transport_types_format);
  }
}
