import { inject, injectable } from "tsyringe";

import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/Providers.repository.interface";
import { AppError } from "@shared/errors/AppError";
import { FORBIDDEN, NOT_FOUND } from "@shared/errors/constants";

interface Params {
  provider_id: string;
  provider_locals_types_ids: string[];
}
@injectable()
export class DeleteLocalsTypesProvidersService {
  constructor(
    @inject("ProvidersRepository")
    private providersRepository: ProvidersRepositoryInterface
  ) {}
  async execute({
    provider_id,
    provider_locals_types_ids,
  }: Params): Promise<void> {
    const provider = await this.providersRepository.findById(provider_id);

    if (!provider) {
      throw new AppError(NOT_FOUND.PROVIDER_DOES_NOT_EXIST);
    }

    if (
      !provider_locals_types_ids.every((local_type_provider) =>
        provider.locals_types.some(
          (local_type) => local_type.id === local_type_provider
        )
      )
    ) {
      throw new AppError(FORBIDDEN.LOCALS_TYPE_BELONGS_TO_ANOTHER_PROVIDER);
    }

    await this.providersRepository.deleteProviderLocalsTypes({
      provider_locals_types_ids,
    });
  }
}
