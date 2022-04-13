import { LOCALS_TYPES_ENUM } from "@modules/accounts/enums/LocalsTypes.enum";
import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";
import {
  InterfaceDetailsProviderLocal,
  ProviderAddress,
} from "@modules/accounts/infra/typeorm/entities/ProviderAddress";
import { DetailsProviderTransportType } from "@modules/accounts/infra/typeorm/entities/ProviderTransportTypes";
import { Service } from "@modules/accounts/infra/typeorm/entities/Services";
import { Address } from "@modules/addresses/infra/typeorm/entities/Address";
import { STATUS_PROVIDERS_APPOINTMENT } from "@modules/appointments/enums/StatusProvidersAppointment.enum";
import { PAYMENT_TYPES_ENUM } from "@modules/transactions/enums";
import { TRANSPORT_TYPES_ENUM } from "@modules/transports/enums/TransportsTypes.enum";

interface StageCacheData {
  route: string;
  children: string;
  params_name: string;
}
interface HourStartEnd {
  hour: string;
  selected: boolean;
  day: string;
  available: boolean;
  date: number;
  available_period: boolean;
  time_blocked: boolean;
}
interface Hour {
  start: HourStartEnd;
  end: HourStartEnd;
}
interface LocalDetails extends InterfaceDetailsProviderLocal {
  local_initial: Address;
  local_destination: Address;
  local_destination_identification: string;
  distance_between: any;
}
export interface LocalCacheData extends ProviderAddress {
  details: LocalDetails;
}
interface LocalTypeCacheData {
  id: string;
  provider_id: string;
  local_type: LOCALS_TYPES_ENUM;
  active: boolean;
}
interface TransportType {
  id: string;
  name: TRANSPORT_TYPES_ENUM;
  description: null;
  active: boolean;
}
export interface TransporTypeProviderCacheData {
  id: string;
  provider_id: string;
  transport_type_id: string;
  active: boolean;
  details: DetailsProviderTransportType;
  amount: number;
  transport_type: TransportType;
}
interface PaymentTypeCacheData {
  id: string;
  name: PAYMENT_TYPES_ENUM;
  description: null;
  active: boolean;
  created_at: Date;
  updated_at: null;
  deleted_at: null;
}
export interface PaymentTypeProviderCacheData {
  id: string;
  provider_id: string;
  payment_type_id: string;
  active: boolean;
  payment_type: PaymentTypeCacheData;
  select: boolean;
}
export interface AppointmentCacheData {
  provider: Provider;
  services: Service[];
  stage: StageCacheData;
  necessaryMilliseconds: number;
  hours: Hour;
  localType: LocalTypeCacheData;
  transportType: TransporTypeProviderCacheData;
  local: LocalCacheData;
  paymentType: PaymentTypeProviderCacheData;
  status: STATUS_PROVIDERS_APPOINTMENT;
  amountTotal: number;
  card: string;
}
