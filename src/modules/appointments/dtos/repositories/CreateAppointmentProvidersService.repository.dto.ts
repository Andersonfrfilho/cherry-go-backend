import { Service } from "@modules/accounts/infra/typeorm/entities/Services";

export interface CreateAppointmentProvidersServiceRepositoryDTO {
  appointment_id: string;
  services: Service[];
}
