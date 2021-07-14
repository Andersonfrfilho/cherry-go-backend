import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";

export interface CreateAppointmentProvidersRepositoryDTO {
  providers: Provider[];
  appointment_id: string;
  active: boolean;
}
