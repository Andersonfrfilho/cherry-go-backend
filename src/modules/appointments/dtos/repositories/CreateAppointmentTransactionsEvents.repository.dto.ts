import { STATUS_EVENTS_TRANSACTIONS_ENUM } from "@modules/transactions/enums";

export interface CreateAppointmentTransactionsEventsRepositoryRepositoryDTO {
  transaction_id: string;
  status: STATUS_EVENTS_TRANSACTIONS_ENUM;
  amount: number;
  payment_type_id?: string;
  details: string;
}
