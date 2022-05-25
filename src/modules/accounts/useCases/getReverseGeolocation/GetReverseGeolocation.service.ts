import { inject, injectable } from "tsyringe";

import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { Address } from "@modules/addresses/infra/typeorm/entities/Address";
import { GeolocationProviderInterface } from "@shared/container/providers/GeolocationProvider/Geolocation.provider.interface";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";

interface ParamsDTO {
  latitude: string;
  longitude: string;
}

@injectable()
export class GetReverseGeolocationService {
  constructor(
    @inject("GeolocationProvider")
    private geolocationProvider: GeolocationProviderInterface
  ) {}
  async execute({ latitude, longitude }: ParamsDTO): Promise<Address> {
    const address =
      await this.geolocationProvider.reverseGeocodingByLatitudeLongitude({
        latitude,
        longitude,
      });

    return address;
  }
}
