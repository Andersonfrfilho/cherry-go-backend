import {
  NATIONALITY_ISO_3166_2_ENUM,
  STRIPE_BUSINESS_TYPE_ENUM,
  STRIPE_CURRENCY_ENUM,
} from "../enums/stripe.enums";

export interface CreateAccountBankAccountDTO {
  account_id: string;
  bank_account: {
    country: NATIONALITY_ISO_3166_2_ENUM;
    currency: STRIPE_CURRENCY_ENUM;
    account_holder_name: string;
    account_holder_type: STRIPE_BUSINESS_TYPE_ENUM;
    code_bank: string;
    account_number: string;
    branch_number: string;
  };
}
