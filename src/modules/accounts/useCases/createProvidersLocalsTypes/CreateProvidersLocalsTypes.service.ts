import { inject, injectable } from "tsyringe";

import { LOCALS_TYPES_ENUM } from "@modules/accounts/enums/localsTypes.enum";
import { ProviderLocalType } from "@modules/accounts/infra/typeorm/entities/ProviderLocalType";
import { ProviderPaymentType } from "@modules/accounts/infra/typeorm/entities/ProviderPaymentType";
import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/Providers.repository.interface";
import { PaymentTypeRepositoryInterface } from "@modules/appointments/repositories/PaymentType.repository.interface";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";

interface ParamsDTO {
  provider_id: string;
  locals_types: Array<LOCALS_TYPES_ENUM>;
}
@injectable()
class CreateProvidersLocalsTypesService {
  constructor(
    @inject("ProvidersRepository")
    private providersRepository: ProvidersRepositoryInterface,
    @inject("PaymentTypeRepository")
    private paymentTypeRepository: PaymentTypeRepositoryInterface
  ) {}
  async execute({
    provider_id,
    locals_types,
  }: ParamsDTO): Promise<ProviderLocalType[]> {
    const provider = await this.providersRepository.findById(provider_id);

    if (!provider) {
      throw new AppError(NOT_FOUND.PROVIDER_DOES_NOT_EXIST);
    }

    const local_types_exist = locals_types.filter((local) =>
      provider.locals_types.every(
        (local_type) => local_type.local_type !== local
      )
    );
    if (local_types_exist.length === 0) {
      return provider.locals_types;
    }

    await this.providersRepository.createProviderLocalsTypes({
      provider_id,
      locals_types: local_types_exist,
    });

    const provider_new_infos = await this.providersRepository.findById(
      provider_id
    );

    return provider_new_infos.locals_types;
  }
}
export { CreateProvidersLocalsTypesService };
