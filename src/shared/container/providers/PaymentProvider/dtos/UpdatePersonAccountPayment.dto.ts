import { GENDERS_ENUM } from "@modules/accounts/enums/GendersUsers.enum";

import { STRIPE_POLITICAL_EXPOSURE } from "../enums/stripe.enums";

interface Address {
  city: string;
  country: string;
  line1: string;
  line2: string;
  postal_code: string;
  state: string;
}

interface DateBirth {
  day: number;
  month: number;
  year: number;
}

export interface UpdatePersonAccountPaymentDTO {
  account_id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  address?: Address;
  cpf?: string;
  birth_date: Date;
  phone?: string;
  gender?: GENDERS_ENUM;
  political_exposure?: STRIPE_POLITICAL_EXPOSURE;
  verification?: {
    details_code?: null;
    document?: {
      back?: null;
      details?: null;
      details_code?: null;
      front?: null;
    };
  };
}
