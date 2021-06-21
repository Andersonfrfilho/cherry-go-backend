import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";
import { ProviderService } from "@modules/accounts/infra/typeorm/entities/ProviderService";
import { Service } from "@modules/accounts/infra/typeorm/entities/Services";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { Appointment } from "@modules/appointments/infra/typeorm/entities/Appointment";
import { Transaction } from "@modules/transactions/infra/typeorm/entities/Transaction";
import { Transport } from "@modules/transports/infra/typeorm/entities/Transport";

export interface CreateAppointmentServiceDTO {
  appointment: Appointment;
  services: Partial<Service>[];
  transactions: Partial<Transaction>[];
  transports: Partial<Transport>[];
  users: Partial<User>[];
  providers: Partial<Provider>[];
  providers_services: Partial<ProviderService>[];
}
