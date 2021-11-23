import { inject, injectable } from "tsyringe";

import { ProviderAddress } from "@modules/accounts/infra/typeorm/entities/ProviderAddress";
import { ProviderLocalType } from "@modules/accounts/infra/typeorm/entities/ProviderLocalType";
import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/Providers.repository.interface";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";

interface ParamsResponseDTO {
  locals_types: ProviderLocalType[];
  locals: ProviderAddress[];
}
@injectable()
export class GetAllLocalsTypesProvidersService {
  constructor(
    @inject("ProvidersRepository")
    private providersRepository: ProvidersRepositoryInterface
  ) {}
  async execute(provider_id: string): Promise<ParamsResponseDTO> {
    const provider = await this.providersRepository.findById(provider_id);

    if (!provider) {
      throw new AppError(NOT_FOUND.PROVIDER_DOES_NOT_EXIST);
    }

    const locals = await this.providersRepository.getAllAddressByProviders(
      provider_id
    );

    return {
      locals_types: provider.locals_types,
      locals,
    };
  }
}
