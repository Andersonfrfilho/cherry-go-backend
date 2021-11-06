import { inject, injectable } from "tsyringe";

import { ProviderAddress } from "@modules/accounts/infra/typeorm/entities/ProviderAddress";
import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/Providers.repository.interface";

@injectable()
export class GetAllLocalsProvidersService {
  constructor(
    @inject("ProviderRepository")
    private providerRepository: ProvidersRepositoryInterface
  ) {}
  async execute(provider_id: string): Promise<ProviderAddress[]> {
    return this.providerRepository.getAllAddressByProviders(provider_id);
  }
}
