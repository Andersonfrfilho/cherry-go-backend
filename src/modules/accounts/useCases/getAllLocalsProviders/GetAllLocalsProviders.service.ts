import { inject, injectable } from "tsyringe";

import { ProviderAddress } from "@modules/accounts/infra/typeorm/entities/ProviderAddress";
import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/Providers.repository.interface";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";

@injectable()
export class GetAllLocalsProvidersService {
  constructor(
    @inject("ProviderRepository")
    private providerRepository: ProvidersRepositoryInterface
  ) {}
  async execute(provider_id: string): Promise<ProviderAddress[]> {
    const provider = await this.providerRepository.findById(provider_id);

    if (provider) {
      throw new AppError(NOT_FOUND.PROVIDER_DOES_NOT_EXIST);
    }

    return this.providerRepository.getAllAddressByProviders(provider_id);
  }
}
