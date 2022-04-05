import {
  LocalCacheData,
  PaymentTypeProviderCacheData,
  TransporTypeProviderCacheData,
} from "@modules/accounts/dtos/services/CreateAppointmentPaymentCard.service.dto";
import { Service } from "@modules/accounts/infra/typeorm/entities/Services";

export interface TransactionCreateAppointmentRepositoryDTO {
  initial_date?: Date;
  final_date?: Date;
  confirm: boolean;
  address: LocalCacheData;
  client_id: string;
  provider_id: string;
  current_amount: number;
  discount_amount: number;
  increment_amount: number;
  original_amount: number;
  services: Service[];
  transport_type: TransporTypeProviderCacheData;
  payment_type: PaymentTypeProviderCacheData;
  duration_total: number;
  local_type: string;
}
