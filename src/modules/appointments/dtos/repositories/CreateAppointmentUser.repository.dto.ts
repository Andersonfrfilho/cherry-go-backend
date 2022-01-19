import { User } from "@modules/accounts/infra/typeorm/entities/User";

export interface CreateAppointmentUsersRepositoryDTO {
  users: Partial<User>[];
  appointment_id: string;
  active: boolean;
}
