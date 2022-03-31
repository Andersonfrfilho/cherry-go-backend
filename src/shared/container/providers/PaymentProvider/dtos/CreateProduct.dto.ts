import { ServicesProviderTypesEnum } from "@modules/accounts/enums/ServicesProviderTypes.enum";

import { STRIPE_PRODUCT_TYPE_ENUM } from "../enums/stripe.enums";

export interface CreateProductDTO {
  amount: number;
  name: string;
  active: boolean;
  description: string;
  service_type: ServicesProviderTypesEnum;
  type_product?: STRIPE_PRODUCT_TYPE_ENUM;
}
