import { inject, injectable } from "tsyringe";

import { CreateProvidersPaymentsTypesServiceDTO } from "@modules/accounts/dtos";
import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/Providers.repository.interface";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";

@injectable()
class CreateProvidersPaymentsTypesService {
  constructor(
    @inject("ProvidersRepository")
    private providersRepository: ProvidersRepositoryInterface
  ) {}
  async execute({
    provider_id,
    payments_types,
  }: CreateProvidersPaymentsTypesServiceDTO): Promise<void> {
    const provider = await this.providersRepository.findById(provider_id);

    if (!provider) {
      throw new AppError(NOT_FOUND.PROVIDER_DOES_NOT_EXIST);
    }

    await this.providersRepository.createPaymentTypesAvailable({
      provider_id,
      payments_types,
    });
  }
}
export { CreateProvidersPaymentsTypesService };
