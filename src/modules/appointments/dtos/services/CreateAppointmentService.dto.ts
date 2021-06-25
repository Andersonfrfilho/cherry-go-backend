import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";
import { Service } from "@modules/accounts/infra/typeorm/entities/Services";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { Address } from "@modules/addresses/infra/typeorm/entities/Address";
import { Appointment } from "@modules/appointments/infra/typeorm/entities/Appointment";
import { Transaction } from "@modules/transactions/infra/typeorm/entities/Transaction";
import { Transport } from "@modules/transports/infra/typeorm/entities/Transport";

interface ServiceDiscount extends Service {
  discount: number;
}

interface TransportDiscount extends Transport {
  discount: number;
}
export interface CreateAppointmentProviders {
  provider: Provider;
  services: Partial<ServiceDiscount>[];
  transports: Partial<TransportDiscount>[];
}

export interface CreateAppointmentServiceDTO {
  appointment: Appointment;
  transactions: Partial<Transaction>[];
  local: Address;
  users: Partial<User>[];
  providers: Partial<CreateAppointmentProviders>[];
}
