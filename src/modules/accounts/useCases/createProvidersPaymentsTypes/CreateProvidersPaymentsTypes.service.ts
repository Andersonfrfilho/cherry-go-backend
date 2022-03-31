import { inject, injectable } from "tsyringe";

import { CreateProvidersPaymentsTypesServiceDTO } from "@modules/accounts/dtos";
import { ProviderPaymentType } from "@modules/accounts/infra/typeorm/entities/ProviderPaymentType";
import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/Providers.repository.interface";
import { PaymentTypeRepositoryInterface } from "@modules/appointments/repositories/PaymentType.repository.interface";
import { PAYMENT_TYPES_ENUM } from "@modules/transactions/enums";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";

@injectable()
class CreateProvidersPaymentsTypesService {
  constructor(
    @inject("ProvidersRepository")
    private providersRepository: ProvidersRepositoryInterface,
    @inject("PaymentTypeRepository")
    private paymentTypeRepository: PaymentTypeRepositoryInterface
  ) {}
  async execute({
    provider_id,
    payments_types,
  }: CreateProvidersPaymentsTypesServiceDTO): Promise<ProviderPaymentType[]> {
    const provider = await this.providersRepository.findById({
      id: provider_id,
    });

    if (!provider) {
      throw new AppError(NOT_FOUND.PROVIDER_DOES_NOT_EXIST);
    }

    const payments_types_exist_all =
      await this.paymentTypeRepository.getAllPaymentTypes();

    if (!payments_types_exist_all) {
      throw new AppError(NOT_FOUND.PAYMENT_TYPES_NOT_FOUND);
    }

    let provider_user_payment_type = payments_types_exist_all.map(
      (payment_type) => ({
        payment_type_id: payment_type.id,
        provider_id: provider.id,
        active: payments_types.some(
          (name_payment_type_to_add) =>
            PAYMENT_TYPES_ENUM[name_payment_type_to_add] === payment_type.name
        ),
      })
    );

    if (provider.payments_types.length > 0) {
      provider_user_payment_type = provider.payments_types.map(
        (payment_type) => {
          const element = provider_user_payment_type.find(
            (payment_type_without_provider) =>
              payment_type_without_provider.payment_type_id ===
                payment_type.payment_type_id &&
              payment_type.provider_id ===
                payment_type_without_provider.provider_id
          );

          if (element) {
            return {
              ...element,
              id: payment_type.id,
            };
          }

          return payment_type;
        }
      );
    }

    await this.providersRepository.createPaymentTypesAvailable(
      provider_user_payment_type
    );

    const user_updated = await this.providersRepository.findById({
      id: provider_id,
    });

    return user_updated.payments_types;
  }
}
export { CreateProvidersPaymentsTypesService };
