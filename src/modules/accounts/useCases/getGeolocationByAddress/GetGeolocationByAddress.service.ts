import { inject, injectable } from "tsyringe";

import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { Address } from "@modules/addresses/infra/typeorm/entities/Address";
import { GeolocationProviderInterface } from "@shared/container/providers/GeolocationProvider/Geolocation.provider.interface";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";

interface ParamsDTO {
  address: string;
}

@injectable()
export class GetGeolocationByAddressService {
  constructor(
    @inject("GeolocationProvider")
    private geolocationProvider: GeolocationProviderInterface
  ) {}
  async execute({ address }: ParamsDTO): Promise<Address> {
    const address_result = await this.geolocationProvider.geocodingByAddress(
      address
    );

    return address_result;
  }
}
