import { inject, injectable } from "tsyringe";

import { config } from "@config/environment";
import { Details } from "@modules/accounts/infra/typeorm/entities/User";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { PaymentType } from "@modules/appointments/infra/typeorm/entities/PaymentType";
import { PaymentTypeRepositoryInterface } from "@modules/appointments/repositories/PaymentType.repository.interface";
import { BankProviderInterface } from "@shared/container/providers/BankProvider/Bank.provider.interface";
import { UserBankTypeEnum } from "@shared/container/providers/BankProvider/dtos/GeneratedIbanCodeParams.dto";
import { CreateAccountBankAccountDTO } from "@shared/container/providers/PaymentProvider/dtos/CreateAccountBankAccount.dto";
import {
  NATIONALITY_ISO_3166_2_ENUM,
  STRIPE_BUSINESS_TYPE_ENUM,
  STRIPE_CURRENCY_ENUM,
} from "@shared/container/providers/PaymentProvider/enums/stripe.enums";
import { PaymentProviderInterface } from "@shared/container/providers/PaymentProvider/Payment.provider.interface";
import { AppError } from "@shared/errors/AppError";
import { BAD_REQUEST, NOT_FOUND } from "@shared/errors/constants";

interface Params {
  user_id: string;
  bank_account_id: string;
}

@injectable()
export class DeleteBankAccountService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface,
    @inject("PaymentProvider")
    private paymentProvider: PaymentProviderInterface
  ) {}
  async execute({ user_id, bank_account_id }: Params): Promise<Details> {
    const user_exist = await this.usersRepository.findById(user_id);

    if (!user_exist) {
      throw new AppError(NOT_FOUND.PROVIDER_DOES_NOT_EXIST);
    }

    if (!user_exist?.details?.stripe?.account?.id) {
      throw new AppError(NOT_FOUND.ACCOUNT_PAYMENT_PROVIDER_DOES_NOT_EXIST);
    }

    if (
      !!user_exist.details.stripe.account.bank_accounts &&
      user_exist.details.stripe.account.bank_accounts.length <= 1
    ) {
      throw new AppError(BAD_REQUEST.ACCOUNT_NUMBERS_MINIMAL_FOR_EXCLUSION);
    }

    await this.paymentProvider.deleteAccountBankAccount({
      account_id: user_exist.details.stripe.account.id,
      bank_account_id,
    });

    const new_bank = user_exist.details.stripe.account.bank_accounts.filter(
      (bank) => bank.id !== bank_account_id
    );

    const details = {
      ...user_exist.details,
      stripe: {
        ...user_exist.details.stripe,
        account: {
          ...user_exist.details.stripe.account,
          bank_accounts: new_bank,
        },
      },
    };

    await this.usersRepository.updateDetailsUser({ id: user_id, details });

    return details;
  }
}
