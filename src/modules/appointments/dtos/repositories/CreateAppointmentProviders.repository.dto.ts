import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";
import { STATUS_PROVIDERS_APPOINTMENT } from "@modules/appointments/enums/StatusProvidersAppointment.enum";

export interface CreateAppointmentProvidersRepositoryDTO {
  providers: Partial<Provider>[];
  appointment_id: string;
  status: STATUS_PROVIDERS_APPOINTMENT;
}
