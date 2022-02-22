import { inject, injectable } from "tsyringe";

import { GENDERS_ENUM } from "@modules/accounts/enums/GendersUsers.enum";
import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/Providers.repository.interface";
import { NATIONALITY_ISO_3166_2 } from "@shared/container/providers/PaymentProvider/enums/stripe.enums";
import { PaymentProviderInterface } from "@shared/container/providers/PaymentProvider/Payment.provider.interface";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";

@injectable()
export class VerifyPaymentAccountInfosService {
  constructor(
    @inject("ProvidersRepository")
    private providersRepository: ProvidersRepositoryInterface,
    @inject("PaymentProvider")
    private paymentProvider: PaymentProviderInterface
  ) {}
  async execute(provider_id: string): Promise<string[]> {
    const provider = await this.providersRepository.findById({id:provider_id});

    if (!provider) {
      throw new AppError(NOT_FOUND.PROVIDER_DOES_NOT_EXIST);
    }

    if (!provider.details.stripe.account.id) {
      throw new AppError(NOT_FOUND.ACCOUNT_PAYMENT_PROVIDER_DOES_NOT_EXIST);
    }

    const { requirements } = await this.paymentProvider.getAccount(
      provider.details.stripe.account.id
    );

    return requirements.currently_due;
  }
}
