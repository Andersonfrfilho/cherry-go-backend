import { injectable } from "tsyringe";

import { NATIONALITY_ISO_3166_2_ENUM } from "../../PaymentProvider/enums/stripe.enums";
import { BankProviderInterface } from "../Bank.provider.interface";
import { GeneratedIbanCodeParams } from "../dtos/GeneratedIbanCodeParams.dto";
import { Bank } from "../dtos/GetAll.dto";
import { ALPHABET_BASE_27_ENUM } from "../enum/AlphabetBase27.enum";
import { apiBrailApi } from "./service/api";

@injectable()
export class BrasilApiProvider implements BankProviderInterface {
  generatedIbanCode({
    country_code,
    user,
    ispb_bank,
  }: GeneratedIbanCodeParams): string {
    const { account_number, account_owner, account_type, branch_number } = user;

    const number_country_code = [
      ...NATIONALITY_ISO_3166_2_ENUM[country_code].toString(),
    ].reduce(
      (pre_letter, current_letter) =>
        pre_letter + ALPHABET_BASE_27_ENUM[current_letter],
      ""
    );

    const number_user_type_bank_account = ALPHABET_BASE_27_ENUM[account_type];

    let number_account_owner = account_owner;

    if (!number_account_owner.match("[0-9]+")) {
      number_account_owner = ALPHABET_BASE_27_ENUM[account_owner];
    }

    const user_bank_agency_formatted = branch_number.padStart(5, "0");
    const user_bank_account_formatted = account_number.padStart(10, "0");

    const bban = `${
      ispb_bank +
      user_bank_agency_formatted +
      user_bank_account_formatted +
      number_user_type_bank_account +
      number_account_owner +
      number_country_code
    }00`;
    const bban_mod = BigInt(bban) % BigInt(97);
    const check_code = BigInt(98) - bban_mod;

    return (
      country_code +
      check_code +
      ispb_bank +
      user_bank_agency_formatted +
      user_bank_account_formatted +
      account_type +
      account_owner
    );
  }

  async getAll(): Promise<Bank[]> {
    const { data: banks } = await apiBrailApi.get("/banks/v1");
    return banks;
  }
}
