import { inject, injectable } from "tsyringe";

import { GENDERS_ENUM } from "@modules/accounts/enums/GendersUsers.enum";
import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/Providers.repository.interface";
import { NATIONALITY_ISO_3166_2_ENUM } from "@shared/container/providers/PaymentProvider/enums/stripe.enums";
import { PaymentProviderInterface } from "@shared/container/providers/PaymentProvider/Payment.provider.interface";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";

@injectable()
export class UpdatePaymentAccountPersonService {
  constructor(
    @inject("ProvidersRepository")
    private providersRepository: ProvidersRepositoryInterface,
    @inject("PaymentProvider")
    private paymentProvider: PaymentProviderInterface
  ) {}
  async execute(provider_id: string): Promise<void> {
    const provider = await this.providersRepository.findById({
      id: provider_id,
    });

    if (!provider) {
      throw new AppError(NOT_FOUND.PROVIDER_DOES_NOT_EXIST);
    }

    if (!provider.details.stripe.account.id) {
      throw new AppError(NOT_FOUND.ACCOUNT_PAYMENT_PROVIDER_DOES_NOT_EXIST);
    }

    await this.paymentProvider.updatePersonAccount({
      account_id: provider.details.stripe.account.id,
      birth_date: provider.birth_date,
      address: {
        city: provider.addresses[0].city,
        country: NATIONALITY_ISO_3166_2_ENUM.BR,
        line1: provider.addresses[0].street,
        line2: provider.addresses[0].number,
        postal_code: provider.addresses[0].zipcode,
        state: provider.addresses[0].state,
      },
      cpf: provider.cpf,
      email: provider.email,
      first_name: provider.name,
      last_name: provider.last_name,
      gender: GENDERS_ENUM[provider.gender],
      phone: `${provider.phones[0].country_code}${provider.phones[0].ddd}${provider.phones[0].number}`,
    });
  }
}
