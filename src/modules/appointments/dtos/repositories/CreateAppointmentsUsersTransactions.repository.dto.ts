import { STATUS_TRANSACTION_ENUM } from "@modules/transactions/enums/StatusTransactionsEvents.enums";

export interface CreateAppointmentsUsersTransactionsRepositoryDTO {
  appointment_id: string;
  user_id: string;
  status: STATUS_TRANSACTION_ENUM;
}
