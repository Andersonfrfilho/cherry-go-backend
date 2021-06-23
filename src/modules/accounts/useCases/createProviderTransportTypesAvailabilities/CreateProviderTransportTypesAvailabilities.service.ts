import { inject, injectable } from "tsyringe";

import { CreateProviderTransportTypesAvailabilitiesServiceDTO } from "@modules/accounts/dtos";
import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/ProvidersRepository.interface";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";

@injectable()
export class CreateProviderTransportTypesAvailabilitiesService {
  constructor(
    @inject("ProvidersRepository")
    private providersRepository: ProvidersRepositoryInterface
  ) {}
  async execute({
    provider_id,
    transport_types,
  }: CreateProviderTransportTypesAvailabilitiesServiceDTO): Promise<void> {
    const provider = await this.providersRepository.findById(provider_id);

    if (!provider) {
      throw new AppError(NOT_FOUND.PROVIDER_DOES_NOT_EXIST);
    }

    await this.providersRepository.createTransportTypesAvailable({
      provider_id,
      transport_types,
    });
  }
}
