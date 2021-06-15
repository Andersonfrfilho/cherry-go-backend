import { inject, injectable } from "tsyringe";

import { CreateProviderDaysAvailabilityServiceDTO } from "@modules/accounts/dtos";
import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/ProvidersRepository.interface";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";

@injectable()
class CreateProviderTimesAvailabilitiesService {
  constructor(
    @inject("ProvidersRepository")
    private providersRepository: ProvidersRepositoryInterface
  ) {}
  async execute({
    provider_id,
    days,
  }: CreateProviderDaysAvailabilityServiceDTO): Promise<void> {
    const provider = await this.providersRepository.findById(provider_id);

    if (!provider) {
      throw new AppError(NOT_FOUND.PROVIDER_DOES_NOT_EXIST);
    }

    await this.providersRepository.createDaysAvailable({
      provider_id,
      days,
    });
  }
}
export { CreateProviderTimesAvailabilitiesService };
