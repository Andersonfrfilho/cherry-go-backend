import { inject, injectable } from "tsyringe";

import { CreateProvidersPaymentsTypesServiceDTO } from "@modules/accounts/dtos";
import { ProviderPaymentType } from "@modules/accounts/infra/typeorm/entities/ProviderPaymentType";
import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/Providers.repository.interface";
import { PaymentTypeRepositoryInterface } from "@modules/appointments/repositories/PaymentType.repository.interface";
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
    const provider = await this.providersRepository.findById(provider_id);

    if (!provider) {
      throw new AppError(NOT_FOUND.PROVIDER_DOES_NOT_EXIST);
    }

    const payments_types_all = await this.paymentTypeRepository.getAllPaymentTypes();
    // checa os existentes
    const payments_types_excludes = payments_types_all.filter((payment_type) =>
      payments_types.some(
        (payment_type_name) => payment_type_name === payment_type.name
      )
    );
    // verificar quais não estão na lista
    const payments_types_users = provider.payments_types
      .filter((payment_type_user) =>
        payments_types_excludes.some(
          (payment_type_exclude) =>
            payment_type_exclude.name === payment_type_user.payment.name
        )
      )
      .map((payment_type_user) => payment_type_user.id);

    if (payments_types_users.length >= 1) {
      await this.providersRepository.deletePaymentTypes(payments_types_users);
    }

    const payments_types_includes = payments_types.filter((payment_type) =>
      provider.payments_types.some(
        (payment_type_user) => payment_type_user.payment.name !== payment_type
      )
    );

    if (payments_types_includes.length >= 1) {
      await this.providersRepository.createPaymentTypesAvailable({
        provider_id,
        payments_types,
      });
    }

    const provider_payments_types = await this.providersRepository.getAllPaymentTypes(
      provider_id
    );

    return provider_payments_types;
  }
}
export { CreateProvidersPaymentsTypesService };
