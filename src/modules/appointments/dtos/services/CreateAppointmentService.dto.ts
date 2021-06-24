import { Address } from "@modules/addresses/infra/typeorm/entities/Address";
import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";
import { Service } from "@modules/accounts/infra/typeorm/entities/Services";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { Appointment } from "@modules/appointments/infra/typeorm/entities/Appointment";
import { Transaction } from "@modules/transactions/infra/typeorm/entities/Transaction";
import { Transport } from "@modules/transports/infra/typeorm/entities/Transport";

interface Providers {
  provider: Provider;
  services: Partial<Service>[];
  transports: Partial<Transport>[];
}

export interface CreateAppointmentServiceDTO {
  appointment: Appointment;
  transactions: Partial<Transaction>[];
  local: Address;
  users: Partial<User>[];
  providers: Partial<Providers>[];
}
