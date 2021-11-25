import { inject, injectable } from "tsyringe";

import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/Providers.repository.interface";
import { AppError } from "@shared/errors/AppError";
import { FORBIDDEN, NOT_FOUND } from "@shared/errors/constants";

interface Params {
  provider_id: string;
  provider_addresses_ids: string[];
}
@injectable()
export class CreateLocalProvidersService {
  constructor(
    @inject("ProvidersRepository")
    private providersRepository: ProvidersRepositoryInterface
  ) {}
  async execute({
    provider_id,
    provider_addresses_ids,
  }: Params): Promise<void> {
    const provider = await this.providerRepository.findById(provider_id);

    if (!provider) {
      throw new AppError(NOT_FOUND.PROVIDER_DOES_NOT_EXIST);
    }

    if (
      !provider_addresses_ids.every((address_provider) =>
        provider.locals.some(
          (provider_local) => provider_local.id === address_provider
        )
      )
    ) {
      throw new AppError(FORBIDDEN.LOCALS_BELONGS_TO_ANOTHER_PROVIDER);
    }
    await this.providerRepository.deleteProviderAddress(provider_addresses_ids);
  }
}
