import { GENDERS_ENUM } from "@modules/accounts/enums/GendersUsers.enum";

export interface CreateAccountPaymentDTO {
  email: string;
  name: string;
  cpf: string;
  last_name: string;
  gender: GENDERS_ENUM;
  rg: string;
  birth_date: Date;
}
