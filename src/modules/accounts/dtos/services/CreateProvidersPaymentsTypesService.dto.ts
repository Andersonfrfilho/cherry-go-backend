import { PaymentTypesEnum } from "@modules/transactions/enums/PaymentTypes.enum";

export interface CreateProvidersPaymentsTypesServiceDTO {
  payments_types: PaymentTypesEnum[];
  provider_id: string;
}
