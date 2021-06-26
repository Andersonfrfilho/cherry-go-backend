import { Service } from "@modules/accounts/infra/typeorm/entities/Services";
import { ItensTypesTransactionsEnum } from "@modules/transactions/enums/ItensTypesTransactions.enum";
import { Transport } from "@modules/transports/infra/typeorm/entities/Transport";

interface ServiceDiscount extends Service {
  discount_amount: number;
  increment_amount: number;
}

interface TransportDiscount extends Transport {
  discount_amount: number;
  increment_amount: number;
}

export interface CreateAppointmentTransactionsItensRepositoryDTO {
  transaction_id: string;
  elements: Partial<ServiceDiscount | TransportDiscount>;
  reference_key: string;
  type: ItensTypesTransactionsEnum;
  increment_amount: number;
  discount_amount: number;
  amount: number;
}
