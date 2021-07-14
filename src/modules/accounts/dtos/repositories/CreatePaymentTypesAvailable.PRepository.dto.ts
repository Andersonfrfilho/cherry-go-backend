import { PAYMENT_TYPES_ENUM } from "@modules/transactions/enums/PaymentTypes.enum";

export interface CreatePaymentTypesAvailableRepositoryDTO {
  provider_id: string;
  payments_types: PAYMENT_TYPES_ENUM[];
}
