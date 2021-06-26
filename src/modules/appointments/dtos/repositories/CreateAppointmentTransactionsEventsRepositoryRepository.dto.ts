import { StatusEventsTransactionsEnum } from "@modules/transactions/enums";

export interface CreateAppointmentTransactionsEventsRepositoryRepositoryDTO {
  transaction_id: string;
  status: StatusEventsTransactionsEnum;
  amount: number;
  payment_type_id?: string;
  details: string;
}
