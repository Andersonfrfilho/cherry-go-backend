import { inject, injectable } from "tsyringe";

import { CreateAddressUsersProvidersServiceDTO } from "@modules/accounts/dtos";
import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/ProvidersRepository.interface";
import { AppError } from "@shared/errors/AppError";
import { BAD_REQUEST } from "@shared/errors/constants";

@injectable()
export class CreateAddressUserProviderService {
  constructor(
    @inject("ProvidersRepository")
    private providersRepository: ProvidersRepositoryInterface
  ) {}
  async execute({
    provider_id,
    city,
    country,
    district,
    number,
    state,
    street,
    zipcode,
    latitude,
    longitude,
  }: CreateAddressUsersProvidersServiceDTO): Promise<void> {
    const provider_exist = await this.providersRepository.findById(provider_id);

    if (!provider_exist) {
      throw new AppError(BAD_REQUEST.USER_NOT_EXIST);
    }

    await this.providersRepository.createAddressProviders({
      provider_id,
      city,
      country,
      district,
      number,
      state,
      street,
      zipcode,
      latitude,
      longitude,
    });
  }
}
