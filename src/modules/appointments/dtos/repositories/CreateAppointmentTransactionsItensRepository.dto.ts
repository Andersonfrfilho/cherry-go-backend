import { Service } from "@modules/accounts/infra/typeorm/entities/Services";
import { ItensTypesTransactionsEnum } from "@modules/transactions/enums/ItensTypesTransactions.enum";
import { Transport } from "@modules/transports/infra/typeorm/entities/Transport";

export interface CreateAppointmentTransactionsItensRepositoryDTO {
  transactions_id: string;
  elements: Partial<Transport | Service>;
  reference_key: string;
  type: ItensTypesTransactionsEnum;
  increment_amount: number;
  discount_amount: number;
  amount: number;
}
