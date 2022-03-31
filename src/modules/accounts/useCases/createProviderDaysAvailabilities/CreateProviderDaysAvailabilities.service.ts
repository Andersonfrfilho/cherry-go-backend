import { inject, injectable } from "tsyringe";

import { CreateProviderDaysAvailabilityServiceDTO } from "@modules/accounts/dtos";
import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/Providers.repository.interface";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";

@injectable()
class CreateProviderDaysAvailabilitiesService {
  constructor(
    @inject("ProvidersRepository")
    private providersRepository: ProvidersRepositoryInterface
  ) {}
  async execute({
    provider_id,
    days,
  }: CreateProviderDaysAvailabilityServiceDTO): Promise<void> {
    const provider = await this.providersRepository.findById({
      id: provider_id,
    });

    if (!provider) {
      throw new AppError(NOT_FOUND.PROVIDER_DOES_NOT_EXIST);
    }

    await this.providersRepository.deleteAllDaysProviderAvailable({
      provider_id: provider.id,
    });

    await this.providersRepository.createDaysAvailable({
      provider_id,
      days,
    });
  }
}
export { CreateProviderDaysAvailabilitiesService };
