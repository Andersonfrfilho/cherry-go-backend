import { PAYMENT_TYPES_ENUM } from "@modules/transactions/enums/PaymentTypes.enum";

export interface CreateProvidersPaymentsTypesServiceDTO {
  payments_types: PAYMENT_TYPES_ENUM[];
  provider_id: string;
}
