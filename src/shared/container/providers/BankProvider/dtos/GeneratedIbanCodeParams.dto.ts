import { NATIONALITY_ISO_3166_2_ENUM } from "../../PaymentProvider/enums/stripe.enums";

export enum UserBankTypeEnum {
  C = "C",
  S = "S",
}

interface UserBank {
  branch_number: string;
  account_number: string;
  account_type: UserBankTypeEnum;
  account_owner: string;
}

export interface GeneratedIbanCodeParams {
  country_code: NATIONALITY_ISO_3166_2_ENUM;
  ispb_bank: string;
  user: UserBank;
}
