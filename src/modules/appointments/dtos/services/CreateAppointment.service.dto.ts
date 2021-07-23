import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";
import { Service } from "@modules/accounts/infra/typeorm/entities/Services";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { Address } from "@modules/addresses/infra/typeorm/entities/Address";
import { Transaction } from "@modules/transactions/infra/typeorm/entities/Transaction";
import { Transport } from "@modules/transports/infra/typeorm/entities/Transport";

interface ServiceDiscount extends Service {
  discount_amount: number;
  increment_amount: number;
}

interface TransportDiscount extends Transport {
  discount_amount: number;
  increment_amount: number;
}
export interface CreateAppointmentProviders {
  provider: Partial<Provider>;
  services: Partial<ServiceDiscount>[];
  transports: Partial<TransportDiscount>[];
}
interface appointment {
  initial_date?: Date;
  final_date?: Date;
  confirm: boolean;
}

export interface CreateAppointmentServiceDTO {
  appointment: appointment;
  transactions: Partial<Transaction>[];
  local: Partial<Address>;
  users: Partial<User>[];
  providers: Partial<CreateAppointmentProviders>[];
}
