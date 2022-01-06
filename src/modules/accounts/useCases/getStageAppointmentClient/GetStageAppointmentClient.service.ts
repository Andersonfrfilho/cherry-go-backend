import { inject, injectable } from "tsyringe";

import {
  ServiceFormattedModalService,
  UserProvider,
} from "@modules/accounts/dtos/services/SetStageAppointmentClient.dto";
import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/Providers.repository.interface";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { CacheProviderInterface } from "@shared/container/providers/CacheProvider/Cache.provider.interface";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";

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
export class GetStageAppointmentClientService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface,
    @inject("CacheProvider")
    private cacheProvider: CacheProviderInterface
  ) {}
  async execute(user_id: string): Promise<SetAppointmentStageClientDTO> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(NOT_FOUND.USER_DOES_NOT_EXIST);
    }

    const favorites_cache = await this.cacheProvider.recover<SetAppointmentStageClientDTO>(
      `clients:${user.id}:appointment`
    );

    return favorites_cache;
  }
}
