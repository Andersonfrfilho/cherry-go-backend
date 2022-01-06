import { classToClass } from "class-transformer";
import { inject, injectable } from "tsyringe";

import { config } from "@config/environment";
import {
  ServiceFormattedModalService,
  UserProvider,
} from "@modules/accounts/dtos/services/SetStageAppointmentClient.dto";
import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";
import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/Providers.repository.interface";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { CacheProviderInterface } from "@shared/container/providers/CacheProvider/Cache.provider.interface";
import { IOREDIS_EXPIRED_ENUM } from "@shared/container/providers/CacheProvider/ioredis.cache.enums";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";

interface ParamDTO {
  user_id: string;
  data: SetAppointmentStageClientDTO;
}

interface StageAppointment {
  route: string;
  children: string;
  params_name: string;
}

interface AppointmentStageClient {
  provider_id: string;
  services: string[];
  stage: StageAppointment;
}

interface SetAppointmentStageClientDTO {
  provider: UserProvider;
  services: ServiceFormattedModalService[];
  stage: AppointmentStageClient;
}

@injectable()
export class SetStageAppointmentClientService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface,
    @inject("ProvidersRepository")
    private providersRepository: ProvidersRepositoryInterface,
    @inject("CacheProvider")
    private cacheProvider: CacheProviderInterface
  ) {}
  async execute({ user_id, data }: ParamDTO): Promise<void> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(NOT_FOUND.USER_DOES_NOT_EXIST);
    }

    await this.cacheProvider.save(
      `clients:${user.id}:appointment`,
      data,
      IOREDIS_EXPIRED_ENUM.EX,
      config.client.cache.invalidade.time
    );
  }
}
