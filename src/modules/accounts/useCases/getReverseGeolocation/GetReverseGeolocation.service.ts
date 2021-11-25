import { inject, injectable } from "tsyringe";

import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { Address } from "@modules/addresses/infra/typeorm/entities/Address";
import { GeolocationProviderInterface } from "@shared/container/providers/GeolocationProvider/Geolocation.provider.interface";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";

interface ParamsDTO {
  user_id: string;
  latitude: string;
  longitude: string;
}

@injectable()
export class GetReverseGeolocationService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface,
    @inject("GeolocationProvider")
    private geolocationProvider: GeolocationProviderInterface
  ) {}
  async execute({ user_id, latitude, longitude }: ParamsDTO): Promise<Address> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(NOT_FOUND.USER_DOES_NOT_EXIST);
    }

    const address = await this.geolocationProvider.reverseGeocodingByLatitudeLongitude(
      {
        latitude,
        longitude,
      }
    );

    return address;
  }
}
