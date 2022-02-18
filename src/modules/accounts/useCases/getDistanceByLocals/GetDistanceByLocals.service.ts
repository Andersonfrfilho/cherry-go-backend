import { inject, injectable } from "tsyringe";

import { LOCALS_TYPES_ENUM } from "@modules/accounts/enums/localsTypes.enum";
import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/Providers.repository.interface";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { Address } from "@modules/addresses/infra/typeorm/entities/Address";
import { GeolocationProviderInterface } from "@shared/container/providers/GeolocationProvider/Geolocation.provider.interface";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";

interface ParamsDTO {
  user_id: string;
  provider_id: string;
  departure_time: number;
}

@injectable()
export class GetDistanceByLocalsService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface,
    @inject("ProvidersRepository")
    private providersRepository: ProvidersRepositoryInterface,
    @inject("GeolocationProvider")
    private geolocationProvider: GeolocationProviderInterface
  ) {}
  async execute({
    user_id,
    provider_id,
    departure_time,
  }: ParamsDTO): Promise<any> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(NOT_FOUND.USER_DOES_NOT_EXIST);
    }

    const provider = await this.providersRepository.findById(provider_id);

    if (!provider) {
      throw new AppError(NOT_FOUND.PROVIDER_DOES_NOT_EXIST);
    }

    const local_client = provider.locals_types.find(
      (local_type) =>
        local_type.local_type.toLowerCase() ===
        LOCALS_TYPES_ENUM.client.toLowerCase()
    );

    let distance_client_local;

    if (local_client) {
      distance_client_local = await this.geolocationProvider.getDistanceTwoAddress(
        {
          local_destination: provider.addresses[0],
          local_initial: user.addresses[0],
          departure_time,
        }
      );
    }

    const local_provider = provider.locals_types.find(
      (local_type) =>
        local_type.local_type.toLowerCase() ===
        LOCALS_TYPES_ENUM.own.toLowerCase()
    );

    let distance_provider_locals;

    if (local_provider) {
      distance_provider_locals = provider.locals.map(async (local) => {
        return this.geolocationProvider.getDistanceTwoAddress({
          local_destination_identification: local.id,
          local_destination: local.address,
          local_initial: user.addresses[0],
          departure_time,
        });
      });
      distance_provider_locals = await Promise.all(distance_provider_locals);
    }

    return {
      distance_client_local,
      distance_provider_locals,
    };
  }
}
