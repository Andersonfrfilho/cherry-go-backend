import { PaymentTypesEnum } from "@modules/transactions/enums/PaymentTypes.enum";

export interface CreatePaymentTypesAvailableRepositoryDTO {
  provider_id: string;
  payments_types: PaymentTypesEnum[];
}
