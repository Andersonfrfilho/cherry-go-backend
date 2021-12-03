import { ServicesProviderTypesEnum } from "@modules/accounts/enums/ServicesProviderTypes.enum";

export interface CreateProductDTO {
  amount: number;
  name: string;
  active: boolean;
  description: string;
  service_type: ServicesProviderTypesEnum;
}
