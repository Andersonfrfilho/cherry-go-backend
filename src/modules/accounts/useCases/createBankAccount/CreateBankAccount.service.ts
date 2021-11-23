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
  country_code: NATIONALITY_ISO_3166_2_ENUM;
  code_bank: string;
  branch_number: string;
  account_number: string;
  account_holder_name: string;
  name_account_bank: string;
}

@injectable()
export class CreateBankAccountService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface,
    @inject("BankProvider")
    private bankProvider: BankProviderInterface,
    @inject("PaymentProvider")
    private paymentProvider: PaymentProviderInterface
  ) {}
  async execute({
    user_id,
    country_code,
    account_number,
    branch_number,
    code_bank,
    account_holder_name,
    name_account_bank,
  }: Params): Promise<Details> {
    const user_exist = await this.usersRepository.findById(user_id);

    if (!user_exist) {
      throw new AppError(NOT_FOUND.PROVIDER_DOES_NOT_EXIST);
    }

    const banks = await this.bankProvider.getAll();

    if (
      !banks.some((bank) => bank.code && bank.code.toString() === code_bank) &&
      !(process.env.ENVIRONMENT === "development")
    ) {
      throw new AppError(NOT_FOUND.BANK_ISPB_DOES_NOT_EXIST);
    }

    if (!user_exist?.details?.stripe?.account?.id) {
      throw new AppError(NOT_FOUND.ACCOUNT_PAYMENT_PROVIDER_DOES_NOT_EXIST);
    }

    if (
      !!user_exist.details.stripe.account.bank_accounts &&
      user_exist.details.stripe.account.bank_accounts.length > 2
    ) {
      throw new AppError(BAD_REQUEST.ACCOUNT_NUMBERS_EXCEEDED);
    }

    const bank_account = {
      country: NATIONALITY_ISO_3166_2_ENUM[country_code],
      currency: STRIPE_CURRENCY_ENUM.brl,
      account_holder_name,
      account_holder_type: STRIPE_BUSINESS_TYPE_ENUM.individual,
      code_bank: code_bank.padStart(3, "0"),
      account_number,
      branch_number,
    };

    const account = await this.paymentProvider.createAccountBankAccount({
      account_id: user_exist.details.stripe.account.id,
      bank_account,
    });

    const details = user_exist.details.stripe.account.bank_accounts
      ? {
          ...user_exist.details,
          stripe: {
            ...user_exist.details.stripe,
            account: {
              ...user_exist.details.stripe.account,
              bank_accounts: [
                ...user_exist.details.stripe.account.bank_accounts,
                {
                  name: name_account_bank,
                  id: account.id,
                },
              ],
            },
          },
        }
      : {
          ...user_exist.details,
          stripe: {
            ...user_exist.details.stripe,
            account: {
              ...user_exist.details.stripe.account,
              bank_accounts: [
                {
                  name: name_account_bank,
                  id: account.id,
                },
              ],
            },
          },
        };

    await this.usersRepository.updateDetailsUser({ id: user_id, details });

    return details;
  }
}
